const mongoose = require("mongoose")

const attendanceSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        requird: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Absent"
    } 
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;


