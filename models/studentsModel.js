// studentModel.js
const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    className: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: { 
        data: Buffer, // Store image data as Buffer
        contentType: String // Store image content type
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
