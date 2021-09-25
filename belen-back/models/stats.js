var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var statSchema = new Schema({

    idStats: { type: Number, default: 1 },
    registerCount: { type: Number, default: 0 },
    statusCount: { type: Number, default: 0 },
    webinarCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stats', statSchema);