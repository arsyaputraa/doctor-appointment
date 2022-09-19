const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const connection = mongoose.connection;

connection.on("connected", () => console.log("mongodb connected"));

connection.on("error", (err) => console.log("mongodb error", err));

module.exports = mongoose;
