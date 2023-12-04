const { uploadFile, deleteFile, getFileSignedUrl } = require("../config/s3-config");
const CandidateRepository  = require("../repository/candidate-repo");
const { signupSchema } = require("../utils/zod-schemas");
const upload = require("../config/multer-config");

const singleUploader = upload.single("avatar");

const candidateRepo = new CandidateRepository();


const candidateSignup = async (req, res) => {
    try {
        singleUploader(req, res, async (err, data) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            const validatedResponse = signupSchema.safeParse(req.body);

            // if validation error
            if (!validatedResponse.success) {
                return res.status(400).json({error: validatedResponse.error});
            }
            const { name, email, password } = validatedResponse.data;
            let avatar;

            // if image file is present, upload to S3
            if (req.file) {
                const file = req.file;
                const fileName = Date.now().toString() + file.originalname;
                avatar = fileName;
                await uploadFile(file.buffer, fileName, file.mimetype);
                // upload file to S3
            }

            const user = await candidateRepo.getCandidateByEmail(email);
            if (user) { // if the account already exist
                return res.status(400).json({err: "Account already exist!"});
            }
            const response = await candidateRepo.create({name, email, password, avatar});
            return res.status(201).json({
                success: true,
                data: {
                    name: response.name,
                    email: response.email,
                    _id: response._id
                },
                err: {}
            });
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            data: {},
            err: error
        });
    }
}


const candidateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await candidateRepo.getCandidateByEmail(email);
        if (!user) {
            throw {message: 'No user found!'};
        }
        if (!user.comparePassword(password)) {
            throw {message: 'Oops! wrong password'};
        }
        const token = await user.generateToken();
        const imageUrl = await getFileSignedUrl(user.avatar);
        user.avatar = imageUrl;
        return res.status(201).json({
            success: true,
            data: token,
            user,
            err: {}
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}


const getCandidate = async (req, res) => {
    try {
        const id = req.params.id;
        const candidate = await candidateRepo.getUserById(id);
        return res.status(200).json({
            success: true,
            data: candidate,
            err: {}
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}


const getAllCandidates = async (req, res) => {
    try {
        const candidates = await candidateRepo.getAll();
        return res.status(200).json({
            success: true,
            data: candidates,
            err: {}
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            err: error
        });
    }
}


module.exports = {
    candidateSignup,
    candidateLogin,
    getCandidate,
    getAllCandidates,
}