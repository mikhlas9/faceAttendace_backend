const express = require("express");
const {addAttendance, getAttendanceOfClass, updateAttendance} = require("../controllers/attendanceController");

const router = express.Router();

// Route to add attendance
router.route("/addAttendance").post(addAttendance);
router.route("/class/:classId").get(getAttendanceOfClass);
router.route("/update").post(updateAttendance);


module.exports = router;
