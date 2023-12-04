const { uploadFile, deleteFile, getFileSignedUrl } = require("../config/s3-config");
const RecruiterRepository  = require("../repository/recruiter-repo");
const { signupSchema } = require("../utils/zod-schemas");
const upload = require("../config/multer-config");

const singleUploader = upload.single("avatar");

const recruiterRepo = new RecruiterRepository();



const recruiterSignup = async (req, res) => {
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
                // upload file to S3
                await uploadFile(file.buffer, fileName, file.mimetype);
            }

            const user = await recruiterRepo.getRecruiterByEmail(email);
            if (user) { // if the account already exist
                return res.status(400).json({err: "Account already exist!"});
            }
            const response = await recruiterRepo.create({name, email, password, avatar});
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
        return res.status(500).json({
            success: false,
            data: {},
            err: error
        });
    }
}


const recruiterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await recruiterRepo.getRecruiterByEmail(email);
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
            role: "recruiter",
            user,
            err: {}
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            data: {},
            err: error.message
        });
    }
}



module.exports = {
    recruiterSignup,
    recruiterLogin
}