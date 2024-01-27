const toursController = require("./../controllers/tourController");
const express = require("express");

const router = express.Router();

// router.param('id', toursController.checkId);

router
  .route("/top-5-cheap")
  .get(toursController.aliasTopTour, toursController.getAllTours);

router.route("/tour-stats").get(toursController.getTourStats);

router
  .route("/")
  .get(toursController.getAllTours)
  .post(toursController.createTour);
router
  .route("/:id")
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
