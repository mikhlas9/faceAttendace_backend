const express = require("express");
const { addStudent, getStudentsOfClass, getStudentImages } = require("../controllers/studentsController");
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })


const router = express.Router();

router.route("/addStudent").post(upload.single('image'), addStudent);
router.route("/class/:classId").get(getStudentsOfClass);
router.route("/images/:classId").get(getStudentImages);

module.exports = router;
