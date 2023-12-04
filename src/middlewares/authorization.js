const recruiter_authorization = async (req, res, next) => {
    try {
        if (req.user.role == "recruiter") {
            next();
        } else {
            throw {err: "Unauthorised! can't access this resource!"}
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}

const candidate_authorization = async (req, res, next) => {
    try {
        if (req.user.role == "candidate") {
            next();
        } else {
            throw {err: "Unauthorised! can't access this resource!"}
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}


module.exports = {
    recruiter_authorization,
    candidate_authorization
}