const mongoose = require("mongoose");

const biodataSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    stream: {
        type: String,
        required: true
    },
    starting_year: {
        type: Number,
        required: true
    },
    ending_year: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enums: ["male", "female", "others"]
    },
    phone: {
        type: Number,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    address: String,
    skills: String,
}, {timestamps: true});


const Biodata = mongoose.model("Biodata", biodataSchema);

module.exports = Biodata;