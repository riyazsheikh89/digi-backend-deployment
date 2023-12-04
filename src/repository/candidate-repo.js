const Candidate = require("../models/candidate.js");
const CrudRepository = require("./crud-repo.js");


class CandidateRepository extends CrudRepository {
    constructor() {
        super(Candidate);
    }

    // Fetch a particular candidate with id
    async getUserById(id) {
        try {
            const result = await Candidate.findById(id)
            .select("-password -createdAt -updatedAt -__v");
            return result;
        } catch (error) {
            console.log('Oops! Something went wrong at CRUD repo');
            throw error;
        }
    }

    // get a candidate by email
    async getCandidateByEmail(email) {
        try {
            const response = await Candidate.findOne({email});
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CandidateRepository;