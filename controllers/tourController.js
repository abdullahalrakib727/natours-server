const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

// sending top 5 cheap tours
const aliasTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name, price, ratingsAverage, summary, difficulty ";
  next();
};

// sending all tours
const getAllTours = async (req, res) => {
  try {
    // execute the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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

// sending single tour by id

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

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

// get tour stats based on difficulty level and ratings

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
      // {
      //   $match: { _id: { $ne: "EASY" } },
      // },
    ]);
    return res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

// get total tour count by months of a year

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    return res.status(404).json({ status: "failed", message: error.message });
  }
};

module.exports = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan,
};
