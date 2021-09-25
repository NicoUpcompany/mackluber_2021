const express = require("express");
const StatsController = require("../controllers/stats");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.get("/stats", [md_auth.ensureAuth], StatsController.getStats);
api.get("/time", StatsController.getTime);

module.exports = api;