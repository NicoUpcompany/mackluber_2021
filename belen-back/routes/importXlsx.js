const express = require("express");
const ImportXlsxController = require("../controllers/importXlsx");

const api = express.Router();

api.post("/import-xlsx", ImportXlsxController.xlsxToJson);

module.exports = api;