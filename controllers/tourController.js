const { Error } = require("mongoose");
const Tour = require("../models/tourModel");

// sending top
const aliasTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name, price, ratingsAverage, summary, difficulty ";
  next();
};

// sending all tours
const getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // Build the query

    // 1A)  filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");

      query = query.sort(sortBy);
      // sort ('price ratingsAverage')
    } else {
      query = query.sort("-createdAt");
    }

    //  3) fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) pagination

    // page=2&limit=10, page=1, 1-10; page=2, 11-20;

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error("This page does not exits");
      }
    }

    // execute the query
    const tours = await query;

    // const tours = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    //  send response
    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

// creating new tour

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

// sending sing tour by id

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id})

    return res.status(200).send({
      status: "success",
      data: tour,
    });
  } catch (error) {
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

// updating tour by id

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: "success",
      data: updatedTour,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

// deleting tour by id

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

module.exports = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  aliasTopTour,
};
