const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/env-variables");

const authentication = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        // if no authHeader, token will be undefined
        if (!token) {
            throw {error: "token not found"}
        }
        
        const response = jwt.verify(token, JWT_SECRET_KEY);
        req.user = response;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}

module.exports = authentication;