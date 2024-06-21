const Class = require("../models/classModel")
const asyncHandler = require("express-async-handler");

const addClass = asyncHandler(async (req, res) => {
    const { className } = req.body;

    try {
        // Create a new class
        const newClass = new Class({ className });
        await newClass.save();

        res.status(201).send('Class added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }

});

// Function to get all classes
const getAllClasses = asyncHandler(async (req, res) => {
    try {
        // Find all classes
        const classes = await Class.find({});

        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = { addClass , getAllClasses}