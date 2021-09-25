const express = require("express");
const QuestionController = require("../controllers/question");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/make-question", [md_auth.ensureAuth], QuestionController.makeQuestion);
api.get("/get-question", [md_auth.ensureAuth], QuestionController.getQuestions);

module.exports = api;