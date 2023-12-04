const Recruiter = require("../models/recruiter");
const CrudRepository = require("./crud-repo");


class RecruiterRepository extends CrudRepository {
    constructor() {
        super(Recruiter);
    }

    // get a user by email
    async getRecruiterByEmail(email) {
        try {
            const response = await Recruiter.findOne({email: email})
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RecruiterRepository;