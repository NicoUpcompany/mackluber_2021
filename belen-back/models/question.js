var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({

    name: { type: String, required: true },
    question: { type: String, required: true },
    shippingTime: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);