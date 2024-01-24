const Tour = require("../models/tourModel");

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
};

const createTour = async (req, res) => {
 await Tour.create({});

  res.status(201).json({
    status: "success",
    // data: { newTour },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).send({
    status: "success",
    data: tour,
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: "will update here",
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
};
