var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validRoles = {
    values: ['Admin', 'User'],
    message: '{VALUE} no es un rol permitido'
};

var userSchema = Schema({
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    rut: { type: String, default: '' },
    phone: { type: String, default: '' },
    region: { type: String, default: '' },
    commune: { type: String, default: '' },
    adress: { type: String, default: '' },
    role: { type: String, default: 'User', enum: validRoles },
    statusPay: { type: Boolean, default: false },
    code: { type: String, required: true, unique: true },
    codeStatus: { type: Boolean, default: true },
    guest: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    payId: { type: String, default: '' },
    hobExperience: { type: Boolean, default: false },
    quantityHobExperience: { type: Number, default: 0 },
    communeHobExperience: { type: String, default: '' },
    totalPayment: { type: String, default: '' },
    totalTickets: { type: String, default: '' },
    totalHob: { type: String, default: '' },
    signUpTime: { type: String, default: '0'},
    signInTime: { type: String, default: '0'},
    waitingRoomTime: { type: String, default: '0'},
    webinarTime: { type: String, default: '0'},
    active: {type:Boolean, default: false},
    counter: {type:Number}
});

module.exports = mongoose.model('User', userSchema);