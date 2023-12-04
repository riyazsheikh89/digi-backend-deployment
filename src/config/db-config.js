const mongoose = require("mongoose");
const { DB_URI } = require("../config/env-variables.js");

const connectDB = async () => {
    await mongoose.connect(DB_URI);
}

const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err.message);
});

//this event will be called only once, when the mongoose connection is made with the db
db.once('open', () => {
    console.log("Database connected successfully!");
});


module.exports = connectDB;