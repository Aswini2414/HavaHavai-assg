const express = require("express");
const connect = require("./database/db");
const router = require("./routes/route");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
const port = 5000;

connect();
app.listen("5000", () => {
    console.log(`Server is running on port ${port}`);
})