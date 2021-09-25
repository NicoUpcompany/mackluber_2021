var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = Schema({

    paymentId: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    currencyType: { type: String, default: 'CLP' },
    paymentMethod: { type: String, default: 'PAGO FACIL' },
    amount: { type: Number, required: true },
    income: { type: String, default: 'VENTA TICKET' },
    status: { type: String, default: 'PENDIENTE' }

});

module.exports = mongoose.model('Payment', paymentSchema);