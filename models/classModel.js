const mongoose = require("mongoose")

const classSchema = mongoose.Schema({
    className: {
        type: String,
        required: true
    }

    
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;


