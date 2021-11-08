const express = require("express");
const RedirectController = require("../controllers/redirect");

const api = express.Router();

api.get("/redirect", RedirectController.getStatus);

module.exports = api;