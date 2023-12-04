class CrudRepository {
    constructor(model) {
        this.model = model
    }

    // Create new record
    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            console.log("Oops! Something went wrong at CRUD repo with Create Funtion");
            throw error;
        }
    }

    // Delete a existing record
    async delete(id) {
        try {
            const response = await this.model.findByIdAndDelete(id);
            return response;
        } catch (error) {
            console.log('Oops! Something went wrong at CRUD repo');
            throw error;
        }
    }

    // Get all record from the collection
    async getAll() {
        try {
            const result = await this.model.find({});
            return result;
        } catch (error) {
            console.log('Oops! Something went wrong at CRUD repo');
            throw error;
        }
    }

    // Get a record by id
    async getById(id) {
        try {
            const result = await this.model.findById(id);
            return result;
        } catch (error) {
            console.log('Oops! Something went wrong at CRUD repo');
            throw error;
        }
    }

    // Update a record with id
    async update(id, data) {
        try {
            //{new: true} - after updating, returns the new updated data
            const response = await this.model.findByIdAndUpdate(id, data, {new: true});
            return response;
        } catch (error) {
            console.log('Oops! Something went wrong at CRUD repo');
            throw error;
        }
    }

}


module.exports = CrudRepository;