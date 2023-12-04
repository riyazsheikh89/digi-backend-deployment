const CrudRepository = require("./crud-repo");
const Biodata = require("../models/biodata");

class BiodataRepository extends CrudRepository {
    constructor() {
        super(Biodata);
    }
}

module.exports = BiodataRepository;