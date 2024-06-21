const asyncHandler = require("express-async-handler");
const Student = require("../models/studentsModel");
const Class = require("../models/classModel");
const fs = require('fs');



// @desc    Add a new student
// @route   POST /api/students
// @access  Public
const addStudent = asyncHandler(async (req, res) => {
    const { name, classId } = req.body;
    const image = req.file.path;

    try {
        if (!name || !classId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Read image file as buffer
        const imageBuffer = fs.readFileSync(image);

        // Create a new student
        const newStudent = await Student.create({
            className: classId,
            name,
            image: { 
                data: imageBuffer, 
                contentType: req.file.mimetype
               } 
        });

        fs.unlink(image, (err) => {
          if (err) {
              console.error(err);
          }
      });

        res.status(201).json({ message: 'Student added successfully', data: newStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const getStudentsOfClass = asyncHandler(async (req, res) => {
    const { classId } = req.params;

    try {
        // Find all students of the specified class
        const students = await Student.find({ className: classId });

        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const getStudentImages = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  try {
    const students = await Student.find({ className: classId });
    const studentImages = students.map(student => ({
      name: student.name,
      image: student.image.data.toString('base64'),
      contentType: student.image.contentType
    }));

    res.status(200).json({ success: true, data: studentImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = { addStudent ,getStudentsOfClass, getStudentImages}