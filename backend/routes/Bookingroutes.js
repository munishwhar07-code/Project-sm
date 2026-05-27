const express = require("express");
const router  = express.Router();
const {
  bookRoom,
  vacateRoom,
  getAllBookings,
  getMyBookings,
  getStudentBookings,
  getBookingById,
} = require("../controller/Bookingcontroller");

const { protect  , authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("student"),
  bookRoom
);
router.get("/",                        getAllBookings);
router.get("/my", protect, getMyBookings);
router.get("/:id",                     getBookingById);
router.get("/student/:phone",          getStudentBookings);
router.post("/",                       bookRoom);
router.patch("/:id/vacate",            vacateRoom);


module.exports = router;