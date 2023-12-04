const { z } = require("zod");

// Schema for signup input validation
const signupSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(8)
    .refine((value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(value);
      }, {
        message: "Password should contain at least one uppercase, one lowercase, one special character, and one number",
      }),
});


// Schema for candidate biodata input validation
const biodataSchema = z.object({
    first_name: z.string().min(2).max(30),
    last_name: z.string().min(2).max(30),
    email: z.string().email(),
    college: z.string().min().max(100),
    degree: z.string(),
    stream: z.string(),
    starting_year: z.string().min(4).max(4),
    ending_year: z.string().min(4).max(4),
    dob: z.string(),
    gender: z.string(),
    phone: z.string().min(10).max(10),
    address: z.string().max(150),
    skills: z.string().max(150),
});

module.exports = {
    signupSchema,
    biodataSchema
}