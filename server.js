const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")

const app = express();
const port = 3000;

require('dotenv/config');
// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


mongoose.connect(process.env.DB, {
})

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use('/', require('./routes'))

app.get("/ping", (req, res, next) => {
    return res.status(200).json({
      message: "Hello World!",
    });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
