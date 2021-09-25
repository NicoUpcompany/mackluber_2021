const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "asDHYdsvCRGSCdbelen2000gbvASVBGFDcszxbVCAvds";

exports.createAccessToken = function(user) {
    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        rut: user.rut,
        phone: user.phone,
        region: user.region,
        commune: user.commune,
        adress: user.adress,
        role: user.role,
        statusPay: user.statusPay,
        code: user.code,
        guest: user.guest,
        payId: user.payId,
        signUpTime: user.signUpTime,
        signInTime: user.signInTime,
        waitingRoomTime: user.waitingRoomTime,
        webinarTime: user.webinarTime,
        createToken: moment().unix(),
        exp: moment().add(10, "hours").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function(user) {
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function(token) {
    return jwt.decode(token, SECRET_KEY, true);
};
