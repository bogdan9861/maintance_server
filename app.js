const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();

const {
  startMaintenanceScheduler,
} = require("./scheduler/maintenance.scheduler");
const { startOverdueScheduler } = require("./scheduler/overdue.scheduler");

startMaintenanceScheduler();
startOverdueScheduler();

const app = express();

app.use(cors({ origin: "*" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/maintenance", require("./routes/maintenance"));
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/reports", require("./routes/reports"));

module.exports = app;
