const express = require("express");
const path = require("path");
const cors = require('cors');

const { PORT } = require("./config/env-variables.js");
const connectDB = require("./config/db-config.js");
const v1Routes = require("./routes/index.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1", v1Routes);

app.use(express.static(path.join(__dirname, "public")));
app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});


app.listen(PORT, async () => {
    console.log(`Server is running on PORT: ${PORT}`);
    await connectDB();
})