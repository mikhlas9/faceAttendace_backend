const Attendance = require("../models/attendanceModel");
const Student = require("../models/studentsModel");
const asyncHandler = require("express-async-handler");

// Controller function to add attendance
const addAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, status } = req.body;

    try {
        // Create a new attendance record
        const newAttendance = new Attendance({ student: studentId, date, status });
        await newAttendance.save();

        res.status(201).send('Attendance added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Function to get attendance of all students of a class for a specific month and year
const getAttendanceOfClass = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const { month, year } = req.query;

    try {
        // Find all students of the specified class
        const students = await Student.find({ className: classId });

        // Get the first and last day of the selected month and year
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);

        // Find attendance records for all students of the class within the specified date range
        const attendance = await Attendance.find({
            student: { $in: students.map(student => student._id) },
            date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }).populate('student', 'name'); // Populate the student field with student name

        // Format attendance data to include student name and date string
        const formattedAttendance = attendance.map(record => ({
            studentId: record.student._id,
            studentName: record.student.name,
            date: record.date.toISOString().split('T')[0],
            status: record.status
        }));

        res.status(200).json({ success: true, data: formattedAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const updateAttendance = asyncHandler(async (req, res) => {
    const { classId, students } = req.body;
    const date = new Date(); // Use current date for attendance

    try {
        // Find all students of the specified class
        const classStudents = await Student.find({ className: classId });

        // Create a map of student names to their IDs
        const studentMap = classStudents.reduce((map, student) => {
            map[student.name] = student._id;
            return map;
        }, {});

        // Create attendance records for recognized students
        const attendanceRecords = students.map(name => ({
            student: studentMap[name],
            date,
            status: 'Present'
        }));

        // Insert attendance records into the database
        await Attendance.insertMany(attendanceRecords);

        res.status(200).json({ success: true, message: 'Attendance updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  

module.exports = { addAttendance, getAttendanceOfClass, updateAttendance };
