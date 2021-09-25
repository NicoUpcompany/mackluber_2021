const Stats = require("../models/stats");

function getStats(req, res) {
    Stats.find().then(stats => {
        if (!stats) {
            res.status(404).send({message: "No se ha encontrado ninguna estadística"});
        } else {
            res.status(200).send({stats});
        }
    });
}

function getTime(req, res) {
    var date = new Date().getTime();
    res.status(200).send({ ok: true, time: date});
}

module.exports = {
    getStats,
    getTime
}