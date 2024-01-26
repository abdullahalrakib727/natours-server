const Tour = require("../models/tourModel");

// sending all tours

const getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // Build the query

    // 1)  filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

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
};
