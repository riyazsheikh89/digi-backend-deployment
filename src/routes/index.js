const express = require("express");

const { getFileSignedUrl } = require("../config/s3-config");
const { recruiter_authorization, candidate_authorization } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

const { candidateLogin, candidateSignup } = require("../controller/candidate");
const { recruiterLogin, recruiterSignup } = require("../controller/recruiter");
const { createBiodata, getAllBiodatas, getBiodataDetails, getResumeUrl, } = require("../controller/biodata");

const Candidate = require("../models/candidate");
const Recruiter = require("../models/recruiter");


const router = express.Router();

// CANDIDATE ROUTES:
router.post("/candidate-signup", candidateSignup);
router.post("/candidate-login", candidateLogin);


//biodata
router.post("/submitbio", authentication, candidate_authorization, createBiodata);


// RECRUITER ROUTES:
router.post("/recruiter-signup", recruiterSignup);
router.post("/recruiter-login", recruiterLogin);
router.get("/get-biodata/:id", authentication, recruiter_authorization, getBiodataDetails);

// router.get("/get-biodatas", authentication, recruiter_authorization, getAllBiodatas);
router.get("/get-biodatas", getAllBiodatas);
router.get("/get-resume/:filename", getResumeUrl);


router.get("/me", authentication, async (req, res) => {
    try {
        const user = req.user;
        let model;
        if (user.role == "candidate") {
            model = Candidate;
        } else {
            model = Recruiter;
        }
        let response = await model.findOne({email: user.email})
            .select("-password -__v -createdAt -updatedAt");
        response.avatar = await getFileSignedUrl(response.avatar);
        const { _id, name, email, avatar } = response;
        return res.status(200).json({
            success: true,
            data: {
                _id, name, email, avatar, role: user.role,
            },
            err: {}
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            err: error.err
        });
    }
})



module.exports = router;