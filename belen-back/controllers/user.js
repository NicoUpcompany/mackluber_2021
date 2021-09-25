var randomString = require('random-string');
var nodemailer = require("nodemailer");
var jwt = require("../services/jwt");
var User = require("../models/user");
var Stats = require("../models/stats");

var upEmail = process.env.EMAIL;
var upPassword = process.env.PASSWORD_EMAIL;

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: upEmail,
        pass: upPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

function signUp(req, res) {

    const { fullName, email, phone, rut, region, commune, adress, hobExperience, quantityHobExperience, communeHobExperience, guest, signUpTime, payId, totalPayment, totalTickets, totalHob } = req.body;

    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.phone = phone;
    user.rut = rut;
    user.region = region;
    user.commune = commune;
    user.adress = adress;
    user.hobExperience = hobExperience;
    user.quantityHobExperience = quantityHobExperience;
    user.communeHobExperience = communeHobExperience;
    user.guest = guest;
    user.signUpTime = signUpTime;
    user.payId = payId;
    user.totalPayment = totalPayment;
    user.totalTickets = totalTickets;
    user.totalHob = totalHob;
    user.code = randomString();
    user.save((err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor 001" });
        } else {
            if (!userStored) {
                res.status(500).send({ message: "Error al crear el usuario" });
            } else {
                Stats.findOne({idStats: 1}, (err, statStored) => {
                    statStored.registerCount = statStored.registerCount + 1;
                    Stats.findByIdAndUpdate({ _id: statStored.id }, statStored, (err, statUpdate) => {
                        if (err) {
                            res.status(500).send({ message: "Error de servidor 002" });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    });
                });
            }
        }
    });
}

// function signIn(req, res) {

//     const { email, signInTime } = req.body;
  
//     User.findOne({code}, (err, userStored) => {
//         if (err) {
//             res.status(500).send({ ok: false, message: "Error del servidor"});
//         } else {
//             if (!userStored) {
//                 res.status(404).send({ ok: false, message: "Ticket no válido"});
//             } else {
//                 if (!userStored.statusPay && userStored.role === 'User') {
//                     res.status(404).send({ ok: false, message: "Debes comprar un ticket"});
//                 } else {
//                     if (!userStored.codeStatus && userStored.role === 'User') {
//                         res.status(404).send({ ok: false, message: "El ticket ya fue utilizado"});
//                     } else {
//                         userStored.signInTime = signInTime;
//                         userStored.codeStatus = false;
//                         User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
//                             if (err) {
//                                 res.status(500).send({ ok: false, message: "Error del servidor"});
//                             } else {
//                                 if (!userUpdate) {
//                                     res.status(404).send({ ok: false, message: "No se ha encontrado el usuario"});
//                                 } else {
//                                     if (userStored.fullName === 'Código de cortesía') {
//                                         res.status(200).send({
//                                             ok: true,
//                                             cortesiaCode: true,
//                                             accessToken: jwt.createAccessToken(userStored),
//                                             refreshToken: jwt.createRefreshToken(userStored)
//                                         });
//                                     } else {
//                                         res.status(200).send({
//                                             ok: true,
//                                             cortesiaCode: false,
//                                             accessToken: jwt.createAccessToken(userStored),
//                                             refreshToken: jwt.createRefreshToken(userStored)
//                                         });
//                                     }
//                                 }
//                             }
//                         });
//                     }
//                 }
//             }
//         }
//     });
// }

function signIn(req, res) {
	let { email, signInTime } = req.body;

	email = email.toString().toLowerCase();

	// const signInTime = moment().subtract(3, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ ok: false, message: "Usuario no encontrado" });
			} else {
				if (!userStored.active) {
					res.status(403).send({ ok: false, message: "Ingreso no permitido" });
				} else {
					userStored.signInTime = signInTime;
					User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
						if (err) {
							res.status(500).send({ ok: false, message: "Error del servidor" });
						} else {
							if (!userUpdate) {
								res.status(404).send({ ok: false, message: "No se ha encontrado el usuario" });
							} else {
								res.status(200).send({
									ok: true,
									accessToken: jwt.createAccessToken(userUpdate),
									refreshToken: jwt.createRefreshToken(userUpdate),
								});
							}
						}
					});
				}
			}
		}
	});
}

function signInAdmin(req, res) {
    const params = req.body;
    var signInTime = req.body.signInTime;
    const email = params.email;
  
    User.findOne({email}, (err, userStored) => {
        if (err) {
            res.status(500).send({message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({message: "Usuario no encontrado"});
            } else {
                if (userStored.role !== 'Admin') {
                    res.status(403).send({message: "No eres administrador"});
                } else {
                    userStored.signInTime = signInTime;
                    User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
                        if (err) {
                            res.status(500).send({message: "Error del servidor"});
                        } else {
                            if (!userUpdate) {
                                res.status(404).send({message: "No se ha encontrado el usuario"});
                            } else {
                                Stats.findOne({idStats: 1}, (err, statStored) => {
                                    if (err) {
                                        res.status(500).send({ message: "Error de servidor" });
                                    } else {
                                        statStored.statusCount = statStored.statusCount + 1;
                                        Stats.findByIdAndUpdate({ _id: statStored.id }, statStored, (err, statUpdate) => {
                                            if (err) {
                                                res.status(500).send({ message: "Error de servidor" });
                                            } else {
                                                res.status(200).send({
                                                    accessToken: jwt.createAccessToken(userUpdate),
                                                    refreshToken: jwt.createRefreshToken(userUpdate)
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

function getUsers(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({message: "No se ha encontrado ningún usuario"});
        } else {
            res.status(200).send({users});
        }
    });
}

function getUsers2(req, res) {
    const from = req.body.from || 0;
  
    User.find().skip(parseInt(from)).limit(300).exec( (err, users) => {
        if (err) {
          res.status(404).send({message: "No se ha encontrado ningún usuario"});
        }
        User.count({}, (err, total) => {
            User.count({signInTime: '0'}, (err, signInTime) => {
                User.count({waitingRoomTime: '0'}, (err, waitingRoomTime) => {
                    User.count({webinarTime: '0'}, (err, webinarTime) => {
                        res.status(200).json({
                            users,
                            total,
                            signInTime,
                            waitingRoomTime,
                            webinarTime
                        });
                    });
                });
            });
        });
    });
}

function updateCortesiaCode(req, res) {
    const { code, fullName, email } = req.body;

    User.findOne({code}, (err, userStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({ ok: false, message: "Usuario no encontrado"});
            } else {
                userStored.fullName = fullName;
                userStored.email = email;
                User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "Error del servidor"});
                    } else {
                        if (!userUpdate) {
                            res.status(404).send({ ok: false, message: "No se ha encontrado el usuario"});
                        } else {
                            res.status(200).send({
                                ok: true,
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                });
            }
        }
    });
}

function updateWaitingRoomTime(req, res) {
    const { code, waitingRoomTime } = req.body;

    User.findOne({code}, (err, userStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({ ok: false, message: "Usuario no encontrado"});
            } else {
                userStored.waitingRoomTime = waitingRoomTime;
                User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "Error del servidor"});
                    } else {
                        if (!userUpdate) {
                            res.status(404).send({ ok: false, message: "No se ha encontrado el usuario"});
                        } else {
                            res.status(200).send({
                                ok: true,
                                accessToken: jwt.createAccessToken(userUpdate),
                                refreshToken: jwt.createRefreshToken(userUpdate)
                            });
                        }
                    }
                });
            }
        }
    });
}

function updateStreamTime(req, res) {
    const { code, streamTime } = req.body;

    User.findOne({code}, (err, userStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({ ok: false, message: "Usuario no encontrado"});
            } else {
                userStored.webinarTime = streamTime;
                User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "Error del servidor"});
                    } else {
                        if (!userUpdate) {
                            res.status(404).send({ ok: false, message: "No se ha encontrado el usuario"});
                        } else {
                            res.status(200).send({
                                ok: true,
                                accessToken: jwt.createAccessToken(userUpdate),
                                refreshToken: jwt.createRefreshToken(userUpdate)
                            });
                        }
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    const params = req.params;

    User.findById({_id: params.id}, (err, userStored) => {
        if (err) {
            res.status(500).send({message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({message: "No se ha encontrado el usuario"});
            } else {
                if (userStored.role === 'Admin') {
                    userStored.role = 'User';
                } else {
                    userStored.role = 'Admin';
                }
                User.findByIdAndUpdate({ _id: params.id }, userStored, (err, userUpdate) => {
                    if (err) {
                        res.status(500).send({message: "Error del servidor"});
                    } else {
                        if (!userUpdate) {
                            res.status(404).send({message: "No se ha encontrado el usuario"});
                        } else {
                            res.status(200).send({message: "Usuario actualizado"});
                        }
                    }
                });
            }
        }
    })
  
}

function generateCortesiaCodes(req, res) {

    const { usersCant, signUpTime } = req.body;

    if (isNaN(parseInt(usersCant))) {
        res.status(400).send({message: "Solo números"});
    } else {
        var cant = parseInt(usersCant);
        if (cant < 1) {
            res.status(400).send({message: "Cantidad no válida"});
        } else {
            var usersCodes = [];
            for (let i = 0; i < cant; i++) {
                const user = new User();
                user.fullName = 'Código de cortesía';
                user.payId = 'Código de cortesía';
                user.code = randomString();
                user.statusPay = true;
                user.totalPayment = '0';
                user.totalTickets = '0';
                user.totalHob = '0';
                user.signUpTime = signUpTime;
                usersCodes.push(user.code);
                user.save((err, userStored) => {
                    Stats.findOne({idStats: 1}, (err, statStored) => {
                        statStored.registerCount = statStored.registerCount + 1;
                        Stats.findByIdAndUpdate({ _id: statStored.id }, statStored, (err, statUpdate) => {});
                    });
                });
            }
            res.status(200).send({cantidad: usersCodes.length, codes: usersCodes});
        }
    }
}

module.exports = {
    signUp,
    signIn,
    signInAdmin,
    getUsers,
    getUsers2,
    updateCortesiaCode,
    updateWaitingRoomTime,
    updateStreamTime,
    updateUser,
    generateCortesiaCodes
}; 