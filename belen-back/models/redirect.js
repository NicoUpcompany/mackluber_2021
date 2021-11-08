var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var redirectSchema = Schema({
    redirect: {type: Boolean, default: false},
    texto: {type: Boolean, default: false}
});

module.exports = mongoose.model('Redirect', redirectSchema);