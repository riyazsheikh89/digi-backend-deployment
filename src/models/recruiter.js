const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/env-variables");

const recruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://shorturl.at/klNY1"
    }
}, {timestamps: true});


// Coverting plain password into encrypted password
recruiterSchema.pre("save", function(next) {
    const SALT = bcrypt.genSaltSync(9);
    const encryptedPassword = bcrypt.hashSync(this.password, SALT);
    this.password = encryptedPassword;
    next();
});


// Compare plain text password with encrypted password
recruiterSchema.methods.comparePassword = function compare(plainPassword) {
    return bcrypt.compareSync(plainPassword, this.password);
    // returns true if both the paswords matches
}


// Generate JWT token for user authentication
recruiterSchema.methods.generateToken = function createJwtToken() {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        role: "recruiter"
    }, JWT_SECRET_KEY, {expiresIn: '1D'});
    return token;
}

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;