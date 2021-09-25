const Question = require("../models/question");
var moment = require("moment");
moment.locale();

function makeQuestion(req, res) {
    const { name, userQuestion } = req.body;
    const question = new Question();

    question.name = name;
    question.question = userQuestion;
    question.shippingTime = moment().format('LLL');

    question.save((err, questionMaked) => {
        if (err) {
            console.log(err)
            res.status(500).send({status: 500, message: "Error del servidor"});
        } else {
            if (!questionMaked) {
                res.status(404).send({status: 404, message: "Error al hacer pregunta"});
            } else {
                res.status(200).send({status: 200, message: "Pregunta enviada"});
            }
        }
    });
}

function getQuestions(req, res) {
    Question.find().sort({ order: "asc" }).exec((err, questionStored) => {
        if (err) {
            res.status(500).send({message: "Error del servidor"});
        } else {
            if (!questionStored) {
                res.status(404).send({message: "No se ha encontrado ninguna pregunta"});
            } else {
                res.status(200).send({preguntas: questionStored});
            }
        }
    });
}

module.exports = {
    makeQuestion,
    getQuestions
}