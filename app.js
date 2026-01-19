const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/items"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/reviews", require("./routes/reviews"));

module.exports = app;
