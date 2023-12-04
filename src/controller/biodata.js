const { uploadFile, deleteFile, getFileSignedUrl } = require("../config/s3-config");
const BiodataRepository  = require("../repository/biodata-repo");
const { biodataSchema } = require("../utils/zod-schemas");
const upload = require("../config/multer-config");

const multipleUploader = upload.any();

const biodataRepo = new BiodataRepository();

// submit candidature form to Database
const createBiodata = (req, res) => {
    try {
        multipleUploader(req, res, async (err, data) => {
            if (err) {
                return res.status(500).json({error: err, success: false});
            }
            const validatedData = biodataSchema.safeParse(req.body);
            if (!validatedData.success) {
                return res.status(400).json({
                    err: `Error in ${validatedData.error.issues[0].path} input field`
                });
            }
            let resume_name;
            let image_name;
            const files = req.files;

            // if resume and image file is present, then process it
            if (files.length >= 2) {
                resume_name = Date.now().toString() + files[0].originalname;
                await uploadFile(files[0].buffer, resume_name, files[0].mimetype);

                image_name = Date.now().toString() + files[1].originalname;
                await uploadFile(files[1].buffer, image_name, files[1].mimetype);
            } else {
                return res.status(400).json({error: "all files are mandatory"});
            }
            // storing the files name inside DB, so that we can retrive later on when needed
            validatedData.data.resume = resume_name;
            validatedData.data.image = image_name;

            const response = await biodataRepo.create(validatedData.data);
            return res.status(201).json({ 
                success: true, 
                message: "Successfully submitted your candidature form"
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            err: error
        });
    }
}

// get all biodata records
const getAllBiodatas = async (req, res) => {
    try {
        // fetch all candidates biodatas
        const biodatas = await biodataRepo.getAll();
        for (let i=0; i<biodatas.length; i++) {
            biodatas[i].image = await getFileSignedUrl(biodatas[i].image);
            biodatas[i].resume = await getFileSignedUrl(biodatas[i].resume);
        }
        return res.status(200).json({
            success: true,
            data: biodatas,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            err: error
        });
    }
}

// get a single biodata record
const getBiodataDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await biodataRepo.getById(id);
        return res.status(200).json({
            success: true,
            data: response,
            err: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: {},
            err: error
        });
    }
}

// get signedUrl for the resume_name
const getResumeUrl = async (req, res) => {
    try {
        const filename = req.params.filename;
        const resumeUrl = await getFileSignedUrl(filename);
        return res.status(200).json({
            success: true,
            data: resumeUrl,
            err: {}
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            data: {},
            err: error
        });
    }
}


module.exports = {
    createBiodata,
    getAllBiodatas,
    getBiodataDetails,
    getResumeUrl
}