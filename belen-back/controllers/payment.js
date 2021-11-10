require('dotenv').config();
const ApiPagoFacil = require('@pagofacil/api_pago_facil');
const User = require("../models/user");
const Payment = require("../models/payment");
const Signature = require('@pagofacil/sdk-apis-javascript-signature');
const nodemailer = require("nodemailer");
const paypal = require('paypal-rest-sdk');

const trx = new ApiPagoFacil.TrxsApi();

const tokenService = process.env.TOKEN_SERVICE;
const tokenSecret = process.env.TOKEN_SECRET;

const uuid = require("uuid/v4");

function signInPagoFacil() {
    const username = process.env.PF_USERNAME;
    const password = process.env.PF_PASSWORD;
    
    const loginBody = new ApiPagoFacil.LoginBody(username, password);
    
    const api = new ApiPagoFacil.AuthApi()
    var opts = {
        'loginBody': loginBody
    };
    var callback = function (error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ');
            const loginResponse = data;
            const dataLoginResponse = loginResponse.data;
            const access_token_jwt = dataLoginResponse.access_token_jwt;
    
            console.log("LOGIN RESPONSE", loginResponse.message, dataLoginResponse, access_token_jwt);
        }
    };
    api.usersLoginPost(opts, callback);
}

function makePay(req, res) {

    var value = req.body.amount;
    //var value = 1000;
    var userCode = req.body.code;

    User.findOne({ code: userCode }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor 0001" });
        } else {
            if (!userStored) {
                res.status(500).send({ message: "Error de servidor 0002" });
            } else {
                var postBodyTrx = {
                    x_account_id: tokenService,
                    x_amount: parseInt(value),
                    x_currency: "CLP",
                    x_reference: userStored.payId,
                    x_customer_email: userStored.email,
                    x_url_complete: "https://maklube.upwebinar.cl/api/v1/catch-payment",
                    x_url_cancel: "https://maklube.upwebinar.cl/api/v1/catch-payment",
                    x_url_callback: "https://maklube.upwebinar.cl/api/v1/catch-payment",
                    x_shop_country: "CL",
                    x_session_id: userStored.payId,
                }
            
                // var postBodyTrx = {
                //   x_account_id: tokenService,
                //   x_amount: parseInt(value),
                //   x_currency: "CLP",
                //   x_reference: userStored.payId,
                //   x_customer_email: userStored.email,
                //   x_url_complete: "http://localhost:8080/api/v1/catch-payment",
                //   x_url_cancel: "http://localhost:8080/api/v1/catch-payment",
                //   x_url_callback: "http://localhost:8080/api/v1/catch-payment",
                //   x_shop_country: "CL",
                //   x_session_id: userStored.payId,
                // }
    
                const x_signature = Signature.signPayload(postBodyTrx, tokenSecret);
                postBodyTrx.x_signature = x_signature;
                var optsTrx = {
                    'inlineObject': postBodyTrx
                }
            
                trx.trxsPost(optsTrx, (error, data, response) => {
                    if (error) {
                        res.status(error.status).send({status: error.status, message: error.response.body.message});
                    } else {
                        const payment = new Payment();
                        payment.paymentId = postBodyTrx.x_reference;
                        payment.user = userStored.id;
                        payment.amount = parseInt(value);
                        payment.save((err, paymentStored) => {
                            if (err) {
                                res.status(500).send({ message: "Error de servidor 0003" });
                            } else {
                                if (!paymentStored) {
                                    res.status(500).send({ message: "Error de servidor 0004" });
                                } else {
                                    res.status(200).send({status: 200, response: response.body.data});
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}

function catchCallback(req, res) {

    var resp = req.body;

    var upEmail = process.env.EMAIL;
    var upPassword = process.env.PASSWORD_EMAIL;

    var transporter = nodemailer.createTransport({
        host: "mail.fundacionbelen2000.cl",
        port: 465,
        secure: true, // true for 465, false for other ports
        //service: 'Gmail',
        auth: {
            user: upEmail,
            pass: upPassword
        }
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    if (resp.x_result !== 'completed') {
        // res.redirect('http://localhost:3000/error-pago');
        res.status(500).send({ message: "Error de servidor 0500" });
    } else {
        Payment.findOne({paymentId: resp.x_reference}, (err, paymentStored) => {
            if (err) {
                res.status(500).send({ message: "Error de servidor 0005" });
            } else {
                if (!paymentStored) {
                    res.status(500).send({ message: "Error de servidor 0006" });
                } else {
                    if (paymentStored.status === 'PENDIENTE') {
                        paymentStored.status = 'COMPLETADO';
                        Payment.findByIdAndUpdate({_id: paymentStored.id}, paymentStored, (err, paymentUpdate) => {
                            if (err) {
                                res.status(404).send({message: "Error de servidor 0007"});
                            } else {
                                if (!paymentUpdate) {
                                    res.status(500).send({message: "Error del servidor 0008"});
                                } else {
                                    User.find().then(users => {
                                        if (!users) {
                                            res.status(500).send({message: "Error del servidor 0009"});
                                        } else {
                                            for (let i = 0; i < users.length; i++) {
                                                if (users[i].payId.toString() === paymentStored.paymentId.toString()) {
                                                    users[i].statusPay = true;
                                                    User.findByIdAndUpdate({_id: users[i].id}, users[i], (err, userUpdate) => {
                                                        if (err) {
                                                            res.status(500).send({message: "Error del servidor 0010"});
                                                        } else {
                                                            if (!userUpdate) {
                                                                res.status(500).send({message: "Error del servidor 0011"});
                                                            } else {
                                                                if (userUpdate.guest === null) {
                                                                    User.find({guest: userUpdate.id}).then(users => {
                                                                        var mailOptions = {
                                                                            from: upEmail,
                                                                            to: userUpdate.email,
                                                                            cc: 'info@belen2000.cl',
                                                                            subject: 'Transacción exitosa Maklube 2021',
                                                                            text: 'Transacción exitosa Maklube 2021',
                                                                            html: `
                                                                            <html>
                                                                                <head>
                                                                                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                                    <title>Maklube</title>
                                                                                </head>
                                                                                <body style="background:#f6f6f6;">
                                                                                    <div style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">
                                                                                    
                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                            <tr>
                                                                                                <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;"> 
                                                                                                    <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                                    <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png"  width="20%" align="left"/>
                                                                                                    <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png"  width="30%" align="right"/>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </table>
                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                            <tr>
                                                                                                <td align="center" width="100%" style="color:#fff;padding: 50px 0 20px;"> 
                                                                                                    <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Transacción exitosa!</h3>
                                                                                                    <p style="margin: 0;padding: 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                        Gracias por adherirte a la nueva versión de:<br/>
                                                                                                        <strong>Maklube Fraterno 2021</strong>
                                                                                                    </p>
                                                                                                    <p style="margin: 0;padding: 20px 0 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                        Nº de Compra: <strong>${userUpdate.id}</strong>
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>


                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;padding: 0 50px;">
                                                                                            <tr>
                                                                                                <td align="left" valign="top" width="50%" style="padding: 20px 0 0;font-size: 14px;">
                                                                                                    <p style="padding: 0px 0;color: #000;">
                                                                                                        <strong>Datos del comprador</strong><br/>
                                                                                                        Nombre: ${userUpdate.fullName}<br/>
                                                                                                        Email: ${userUpdate.email}<br/>
                                                                                                        Teléfono: ${userUpdate.phone}<br/>
                                                                                                        Experiencia gastronómica: ${userUpdate.hobExperience ? `Si` : `No`}<br/>
                                                                                                        Cantidad de Box: ${userUpdate.quantityHobExperience}<br/>
                                                                                                        Comuna: ${userUpdate.communeHobExperience}<br/>
                                                                                                        Dirección: ${userUpdate.adress}
                                                                                                    </p>
                                                                                                </td>
                                                                                                <td align="left" valign="top" width="50%" style="padding: 20px 0 0;font-size: 14px;">
                                                                                                    <p style="padding: 0px 0;color: #000;">
                                                                                                        <strong>Resumen de compra</strong><br/>
                                                                                                        Experiencia Gastronomica: $${userUpdate.totalHob}<br/>
                                                                                                        Entrada: $${userUpdate.totalTickets}<br/>
                                                                                                        <br/>
                                                                                                        Total: $${userUpdate.totalPayment}
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>

                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;padding: 0 50px;">

                                                                                            ${users.map(item => `
                                                                                                <tr>
                                                                                                    <td align="left" valign="top" width="50%" style="padding: 0;font-size: 14px;">
                                                                                                        <p style="padding: 40px 0;color: #000;">
                                                                                                            <strong>Datos del invitado</strong><br/>
                                                                                                            Nombre: ${item.fullName}<br/>
                                                                                                            Email: ${item.email}<br/>
                                                                                                            Teléfono: ${item.phone}<br/>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                    <td align="left" valign="top" width="50%" style="padding: 0;font-size: 14px;">
                                                                                                        <p style="padding: 40px 0;color: #000;">
                                                                                                            <strong>Experiencia gastronómica</strong><br/>
                                                                                                            Cantidad de Box: ${item.quantityHobExperience}<br/>
                                                                                                            Comuna: ${item.communeHobExperience}<br/>
                                                                                                            Dirección: ${item.adress}
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            `)}

                                                                                        </table>
                                                                                        

                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                            <tr style="padding: 0 0 50px;">
                                                                                                <td align="center" width="100%" style="padding: 20px 0;"> 
                                                                                                    <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="40%" />
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>

                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="600px" style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                            <tr style="padding: 0 0 50px;">
                                                                                                <td align="center" width="100%"> 
                                                                                                    Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </div>
                                                                                </body>
                                                                            </html>
                                                                            `
                                                                        };
                                                                        transporter.sendMail(mailOptions, function(error, info){
                                                                            if(error){
                                                                                res.status(500).send({message: "Error del servidor 0012"});
                                                                            } else {
                                                                                var mailOptions = {
                                                                                    from: upEmail,
                                                                                    to: userUpdate.email,
                                                                                    subject: 'Adhesión Maklube 2021',
                                                                                    text: 'Adhesión Maklube 2021',
                                                                                    html: `
                                                                                    <html>
                                                                                        <head>
                                                                                            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                                            <title>Maklube</title>
                                                                                        </head>

                                                                                        <body style="background:#f6f6f6;">
                                                                                            <div
                                                                                                style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">

                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                                    <tr>
                                                                                                        <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;"> 
                                                                                                            <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png"  width="20%" align="left"/>
                                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png"  width="30%" align="right"/>
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </table>
                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                                    <tr>
                                                                                                        <td align="center" width="100%" style="color:#000;padding: 50px 0 20px;">
                                                                                                            <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Adhesión exitosa!</h3>
                                                                                                            <p style="margin: 0;padding: 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                                Ya estas listo para ser parte de:<br />
                                                                                                                <strong>Maklube Fraterno 2021</strong>
                                                                                                            </p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>

                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                                    <tr>
                                                                                                        <td align="center" width="100%%" style="padding: 20px 0 20px;color:#000;font-size: 12px;" colspan="3">
                                                                                                            Haz comprado una entrada para el Maklube Fraterno 2021. <br/>
                                                                                                            Miércoles 10 de Noviembre a las 21:00 hrs. <br/>
                                                                                                            Ingresa el correo registrado, que es por el cuál recibiste esta invitación. <br/>
                                                                                                            El correo podrá ser ingresado una vez y en un solo dispositivo. Nos vemos!
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td>&nbsp;</td>
                                                                                                        <td align="center" width="33%" style="padding: 0;">
                                                                                                            <p
                                                                                                                style="margin: 0 auto 30px;color: #000;font-size: 18px;padding: 10px 0 10px 20px;border: 1px solid #e4c3a0;border-radius: 5px;">
                                                                                                                ${userUpdate.email}
                                                                                                            </p>
                                                                                                        </td>
                                                                                                        <td>&nbsp;</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td align="center" width="100%%" style="padding: 20px 115px 20px" colspan="3">
                                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="100%" />
                                                                                                            <p style="border-top: 4px solid #e4c3a0;padding: 40px 0;margin-top: 40px;color: #000;">
                                                                                                                Recuerda conectarte 30 minutos antes.
                                                                                                            </p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>

                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                                    style="margin-top:0;margin-bottom:0;padding: 20px 50px;">
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                                                                style="margin-top:0;margin-bottom:0;border: 1px solid #e4c3a0;border-radius: 10px;">
                                                                                                                <tr>
                                                                                                                    <td colspan="2" style="text-align: center;color: #000;font-size: 14px;padding: 20px 0 0;">
                                                                                                                        Para no perderte ni un segundo, agrégalo en tu calendario
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                <tr>
                                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                                        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202121&dates=20211016T000000Z%2F20211016T020000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl" target="_blank" rel="noopener noreferrer">
                                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal1.png" width="150" />
                                                                                                                        
                                                                                                                        </a>
                                                                                                                    </td>
                                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                                        <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank" rel="noopener noreferrer" className="btn">
                                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal2.png" width="150" />
                                                                                                                        </a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>


                                                                                                <!-- <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                                    <tr style="padding: 0 0 50px;">
                                                                                                        <td align="center" width="100%" style="padding: 20px 0;">
                                                                                                            <img src="https://upwebinar.cl/mailing/maklube/belen.png" width="130" />
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table> -->

                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                                    style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                                    <tr style="padding: 0 0 50px;">
                                                                                                        <td align="center" width="100%">
                                                                                                            Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </div>
                                                                                        </body>
                                                                                        </html>
                                                                                    `
                                                                                };
                                                                                transporter.sendMail(mailOptions, function(error, info){
                                                                                    if(error){
                                                                                        res.status(500).send({message: "Error del servidor 0012"});
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                } else {
                                                                    var mailOptions = {
                                                                        from: upEmail,
                                                                        to: userUpdate.email,
                                                                        subject: 'Adhesión Maklube 2021',
                                                                        text: 'Adhesión Maklube 2021',
                                                                        html: `
                                                                        <html>

                                                                        <head>
                                                                            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                            <title>Maklube</title>
                                                                        </head>
                                                                        
                                                                        <body style="background:#f6f6f6;">
                                                                            <div
                                                                                style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">
                                                                        
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                    <tr>
                                                                                        <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;"> 
                                                                                            <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png"  width="20%" align="left"/>
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png"  width="30%" align="right"/>
                                                                                        </th>
                                                                                    </tr>
                                                                                </table>
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%" style="color:#000;padding: 50px 0 20px;">
                                                                                            <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Adhesión exitosa!</h3>
                                                                                            <p style="margin: 0;padding: 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                Ya estas listo para ser parte de:<br />
                                                                                                <strong>Maklube Fraterno 2021</strong>
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                        
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%%" style="padding: 20px 0 20px;color:#000;font-size: 12px;" colspan="3">
                                                                                            Haz recibido una invitación para el Maklube Fraterno 2021. <br/>
                                                                                            Miércoles 10 de Noviembre a las 21:00 hrs. <br/>
                                                                                            Ingresa el correo registrado, que es por el cuál recibiste esta invitación. <br/>
                                                                                            El correo podrá ser ingresado una vez y en un solo dispositivo. Nos vemos!
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>&nbsp;</td>
                                                                                        <td align="center" width="33%" style="padding: 0;">
                                                                                            <p
                                                                                                style="margin: 0 auto 30px;color: #000;font-size: 18px;padding: 10px 0 10px 20px;border: 1px solid #e4c3a0;border-radius: 5px;">
                                                                                                ${userUpdate.email}
                                                                                            </p>
                                                                                        </td>
                                                                                        <td>&nbsp;</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" width="100%%" style="padding: 20px 115px 20px" colspan="3">
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="100%" />
                                                                                            <p style="border-top: 4px solid #e4c3a0;padding: 40px 0;margin-top: 40px;color: #000;">
                                                                                                Recuerda conectarte 30 minutos antes.
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                        
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                    style="margin-top:0;margin-bottom:0;padding: 20px 50px;">
                                                                                    <tr>
                                                                                        <td>
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                                                style="margin-top:0;margin-bottom:0;border: 1px solid #e4c3a0;border-radius: 10px;">
                                                                                                <tr>
                                                                                                    <td colspan="2" style="text-align: center;color: #000;font-size: 14px;padding: 20px 0 0;">
                                                                                                        Para no perderte ni un segundo, agrégalo en tu calendario
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202121&dates=20211016T000000Z%2F20211016T020000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl" target="_blank" rel="noopener noreferrer">
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal1.png" width="150" />
                                                                                                        
                                                                                                        </a>
                                                                                                    </td>
                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                        <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank" rel="noopener noreferrer" className="btn">
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal2.png" width="150" />
                                                                                                        </a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                        
                                                                        
                                                                                <!-- <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                    <tr style="padding: 0 0 50px;">
                                                                                        <td align="center" width="100%" style="padding: 20px 0;">
                                                                                            <img src="https://upwebinar.cl/mailing/maklube/belen.png" width="130" />
                                                                                        </td>
                                                                                    </tr>
                                                                                </table> -->
                                                                        
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                    style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                    <tr style="padding: 0 0 50px;">
                                                                                        <td align="center" width="100%">
                                                                                            Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </body>
                                                                        
                                                                        </html>
                                                                        `
                                                                    };
                                                                    transporter.sendMail(mailOptions, function(error, info){
                                                                        if(error){
                                                                            res.status(500).send({message: "Error del servidor 0012"});
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        res.redirect('https://maklube.upwebinar.cl/confirmacion');
                    }
                }
            }
        });
    }
}

function makeDonation(req, res) {

    var value = req.body.amount;
    var userEmail = req.body.email;

    var postBodyTrx = {
        x_account_id: tokenService,
        x_amount: parseInt(value),
        x_currency: "CLP",
        x_reference: uuid(),
        x_customer_email: userEmail,
        x_url_complete: "https://maklube.upwebinar.cl/api/v1/catch-donation",
        x_url_cancel: "https://maklube.upwebinar.cl/v1/catch-donation",
        x_url_callback: "https://maklube.upwebinar.cl/api/v1/catch-donation",
        x_shop_country: "CL",
        x_session_id: uuid(),
    }

    // var postBodyTrx = {
    //   x_account_id: tokenService,
    //   x_amount: parseInt(value),
    //   x_currency: "CLP",
    //   x_reference: uuid(),
    //   x_customer_email: userEmail,
    //   x_url_complete: "http://localhost:8080/api/v1/catch-donation",
    //   x_url_cancel: "http://localhost:8080/api/v1/catch-donation",
    //   x_url_callback: "http://localhost:8080/api/v1/catch-donation",
    //   x_shop_country: "CL",
    //   x_session_id: uuid(),
    // }

    const x_signature = Signature.signPayload(postBodyTrx, tokenSecret);
    postBodyTrx.x_signature = x_signature;
    var optsTrx = {
        'inlineObject': postBodyTrx
    }

    trx.trxsPost(optsTrx, (error, data, response) => {
        if (error) {
            res.status(error.status).send({status: error.status, message: error.response.body.message});
        } else {
            const payment = new Payment();
            payment.paymentId = postBodyTrx.x_reference;
            payment.user = null;
            payment.amount = parseInt(value);
            payment.income = 'DONACION';
            payment.save((err, paymentStored) => {
                if (err) {
                    res.status(500).send({ message: "Error de servidor 0015" });
                } else {
                    if (!paymentStored) {
                        res.status(500).send({ message: "Error de servidor 0016" });
                    } else {
                        res.status(200).send({status: 200, response: response.body.data});
                    }
                }
            });
        }
    });
}

function catchDonation(req, res) {

    var resp = req.body;

    if (resp.x_result !== 'completed') {
        res.redirect('https://maklube.upwebinar.cl/error-trx');
    } else {
        Payment.findOne({paymentId: resp.x_reference}, (err, paymentStored) => {
            if (err) {
                res.status(500).send({ message: "Error de servidor 0017" });
            } else {
                if (!paymentStored) {
                    res.status(500).send({ message: "Error de servidor 0018" });
                } else {
                    if (paymentStored.status === 'PENDIENTE') {
                        paymentStored.status === 'COMPLETADO';
                        Payment.findByIdAndUpdate({_id: paymentStored.id}, paymentStored, (err, paymentUpdate) => {
                            if (err) {
                                res.status(404).send({message: "Error de servidor 0019"});
                            } else {
                                if (!paymentUpdate) {
                                    res.status(500).send({message: "Error del servidor 0020"});
                                } else {
                                    res.redirect('https://maklube.upwebinar.cl/confirmacion-donacion');
                                }
                            }
                        });
                    } else {
                        res.redirect('https://maklube.upwebinar.cl/confirmacion-donacion');
                    }
                }
            }
        });
    }
}

function makePayPaypal(req, res) {

    var value = req.body.amount;
    //var value = 1;
    var userCode = req.body.code;

    User.findOne({ code: userCode }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor 0017" });
        } else {
            if (!userStored) {
                res.status(500).send({ message: "Error de servidor 0018" });
            } else {
                const newPayment = new Payment();
                newPayment.paymentId = userStored.payId;
                newPayment.user = userStored.id;
                newPayment.amount = parseInt(value);
                newPayment.currencyType = 'USD';
                newPayment.paymentMethod = 'PAYPAL';
                newPayment.save((err, paymentStored) => {
                    if (err) {
                        res.status(500).send({ message: "Error de servidor 0015" });
                    } else {
                        if (!paymentStored) {
                            res.status(500).send({ message: "Error de servidor 0016" });
                        } else {
                            res.status(200).send({status: 200, response: "OK"});
                        }
                    }
                });
            }
        }
    });
}

function catchCallbackPaypal(req, res) {
    const params = req.params;

    var upEmail = process.env.EMAIL;
    var upPassword = process.env.PASSWORD_EMAIL;

    var transporter = nodemailer.createTransport({
        host: "mail.fundacionbelen2000.cl",
        port: 465,
        secure: true, // true for 465, false for other ports
        //service: 'Gmail',
        auth: {
            user: upEmail,
            pass: upPassword
        }
    });

    Payment.findOne({paymentId: params.id}, (err, paymentStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor 0005" });
        } else {
            if (!paymentStored) {
                res.status(500).send({ message: "Error de servidor 0006" });
            } else {
                if (paymentStored.status === 'PENDIENTE') {
                    paymentStored.status = 'COMPLETADO';
                    Payment.findByIdAndUpdate({_id: paymentStored.id}, paymentStored, (err, paymentUpdate) => {
                        if (err) {
                            res.status(404).send({message: "Error de servidor 0007"});
                        } else {
                            if (!paymentUpdate) {
                                res.status(500).send({message: "Error del servidor 0008"});
                            } else {
                                User.find().then(users => {
                                    if (!users) {
                                        res.status(500).send({message: "Error del servidor 0009"});
                                    } else {
                                        for (let i = 0; i < users.length; i++) {
                                            if (users[i].payId.toString() === paymentStored.paymentId.toString()) {
                                                users[i].statusPay = true;
                                                User.findByIdAndUpdate({_id: users[i].id}, users[i], (err, userUpdate) => {
                                                    if (err) {
                                                        res.status(500).send({message: "Error del servidor 0010"});
                                                    } else {
                                                        if (!userUpdate) {
                                                            res.status(500).send({message: "Error del servidor 0011"});
                                                        } else {
                                                            if (userUpdate.guest === null) {
                                                                User.find({guest: userUpdate.id}).then(users => {
                                                                    var mailOptions = {
                                                                        from: upEmail,
                                                                        to: userUpdate.email,
                                                                        cc: 'info@belen2000.cl',
                                                                        subject: 'Transacción exitosa Maklube 2021',
                                                                        text: 'Transacción exitosa Maklube 2021',
                                                                        html: `
                                                                        <html>
                                                                            <head>
                                                                                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                                <title>Maklube</title>
                                                                            </head>
                                                                            <body style="background:#f6f6f6;">
                                                                                <div style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">
                                                                                
                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                        <tr>
                                                                                            <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;"> 
                                                                                                <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                                <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png"  width="20%" align="left"/>
                                                                                                <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png"  width="30%" align="right"/>
                                                                                            </th>
                                                                                        </tr>
                                                                                    </table>
                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                        <tr>
                                                                                            <td align="center" width="100%" style="color:#fff;padding: 50px 0 20px;"> 
                                                                                                <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Transacción exitosa!</h3>
                                                                                                <p style="margin: 0;padding: 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                    Gracias por adherirte a la nueva versión de:<br/>
                                                                                                    <strong>Maklube Fraterno 2021</strong>
                                                                                                </p>
                                                                                                <p style="margin: 0;padding: 20px 0 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                    Nº de Compra: <strong>${userUpdate.id}</strong>
                                                                                                </p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>


                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;padding: 0 50px;">
                                                                                        <tr>
                                                                                            <td align="left" valign="top" width="50%" style="padding: 20px 0 0;font-size: 14px;">
                                                                                                <p style="padding: 0px 0;color: #000;">
                                                                                                    <strong>Datos del comprador</strong><br/>
                                                                                                    Nombre: ${userUpdate.fullName}<br/>
                                                                                                    Email: ${userUpdate.email}<br/>
                                                                                                    Teléfono: ${userUpdate.phone}<br/>
                                                                                                    Experiencia gastronómica: ${userUpdate.hobExperience ? `Si` : `No`}<br/>
                                                                                                    Cantidad de Box: ${userUpdate.quantityHobExperience}<br/>
                                                                                                    Comuna: ${userUpdate.communeHobExperience}<br/>
                                                                                                    Dirección: ${userUpdate.adress}
                                                                                                </p>
                                                                                            </td>
                                                                                            <td align="left" valign="top" width="50%" style="padding: 20px 0 0;font-size: 14px;">
                                                                                                <p style="padding: 0px 0;color: #000;">
                                                                                                    <strong>Resumen de compra</strong><br/>
                                                                                                    Experiencia Gastronomica: $${userUpdate.totalHob}<br/>
                                                                                                    Entrada: $${userUpdate.totalTickets}<br/>
                                                                                                    <br/>
                                                                                                    Total: $${userUpdate.totalPayment}
                                                                                                </p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>

                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;padding: 0 50px;">

                                                                                        ${users.map(item => `
                                                                                            <tr>
                                                                                                <td align="left" valign="top" width="50%" style="padding: 0;font-size: 14px;">
                                                                                                    <p style="padding: 40px 0;color: #000;">
                                                                                                        <strong>Datos del invitado</strong><br/>
                                                                                                        Nombre: ${item.fullName}<br/>
                                                                                                        Email: ${item.email}<br/>
                                                                                                        Teléfono: ${item.phone}<br/>
                                                                                                    </p>
                                                                                                </td>
                                                                                                <td align="left" valign="top" width="50%" style="padding: 0;font-size: 14px;">
                                                                                                    <p style="padding: 40px 0;color: #000;">
                                                                                                        <strong>Experiencia gastronómica</strong><br/>
                                                                                                        Cantidad de Box: ${item.quantityHobExperience}<br/>
                                                                                                        Comuna: ${item.communeHobExperience}<br/>
                                                                                                        Dirección: ${item.adress}
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        `)}

                                                                                    </table>
                                                                                    

                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                        <tr style="padding: 0 0 50px;">
                                                                                            <td align="center" width="100%" style="padding: 20px 0;"> 
                                                                                                <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="40%" />
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>

                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="600px" style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                        <tr style="padding: 0 0 50px;">
                                                                                            <td align="center" width="100%"> 
                                                                                                Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                            </body>
                                                                        </html>
                                                                        `
                                                                    };
                                                                    transporter.sendMail(mailOptions, function(error, info){
                                                                        if(error){
                                                                            res.status(500).send({message: "Error del servidor 0012"});
                                                                        } else {
                                                                            var mailOptions = {
                                                                                from: upEmail,
                                                                                to: userUpdate.email,
                                                                                subject: 'Adhesión Maklube 2021',
                                                                                text: 'Adhesión Maklube 2021',
                                                                                html: `
                                                                                <html>
                                                                                    <head>
                                                                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                                        <title>Maklube</title>
                                                                                    </head>

                                                                                    <body style="background:#f6f6f6;">
                                                                                        <div
                                                                                            style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                                style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                                <tr>
                                                                                                    <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;">
                                                                                                        <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png" width="20%"
                                                                                                            align="left" />
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png" width="30%"
                                                                                                            align="right" />
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </table>
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                                <tr>
                                                                                                    <td align="center" width="100%" style="color:#000;padding: 50px 0 20px;">
                                                                                                        <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Adhesión exitosa!</h3>
                                                                                                        <p style="margin: 0;padding: 20px;font-size:14px;color:#000;text-align:center;font-weight: 500;">
                                                                                                            <strong>Maklube Fraterno 2021</strong>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                                <tr>
                                                                                                    <td align="center" width="100%%" style="padding: 20px 0 20px;color:#000;font-size: 12px;" colspan="3">
                                                                                                        Haz comprado una entrada para el Maklube Fraterno 2021. <br/>
                                                                                                        Miércoles 10 de Noviembre a las 21:00 hrs. <br/>
                                                                                                        Ingresa el correo registrado, que es por el cuál recibiste esta invitación. <br/>
                                                                                                        El correo podrá ser ingresado una vez y en un solo dispositivo. Nos vemos!
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>&nbsp;</td>
                                                                                                    <td align="center" width="33%" style="padding: 0;">
                                                                                                        <p
                                                                                                            style="margin: 0 auto 30px;color: #000;font-size: 18px;padding: 10px 0 10px 20px;border: 1px solid #e4c3a0;border-radius: 5px;">
                                                                                                            ${userUpdate.email}
                                                                                                        </p>
                                                                                                    </td>
                                                                                                    <td>&nbsp;</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" width="100%%" style="padding: 20px 115px 20px" colspan="3">
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="100%" />
                                                                                                        <p style="border-top: 4px solid #e4c3a0;padding: 40px 0;margin-top: 40px;color: #000;">
                                                                                                            Recuerda conectarte 30 minutos antes.
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                                style="margin-top:0;margin-bottom:0;padding: 20px 50px;">
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                                                            style="margin-top:0;margin-bottom:0;border: 1px solid #e4c3a0;border-radius: 10px;">
                                                                                                            <tr>
                                                                                                                <td colspan="2" style="text-align: center;color: #000;font-size: 14px;padding: 20px 0 0;">
                                                                                                                    Para no perderte ni un segundo, agrégalo en tu calendario
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                                    <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202121&dates=20211016T000000Z%2F20211016T020000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl"
                                                                                                                        target="_blank" rel="noopener noreferrer">
                                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal1.png"
                                                                                                                            width="150" />

                                                                                                                    </a>
                                                                                                                </td>
                                                                                                                <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                                    <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank"
                                                                                                                        rel="noopener noreferrer" className="btn">
                                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal2.png"
                                                                                                                            width="150" />
                                                                                                                    </a>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>


                                                                                            <!-- <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                                                                                                                <tr style="padding: 0 0 50px;">
                                                                                                                                                                                    <td align="center" width="100%" style="padding: 20px 0;">
                                                                                                                                                                                        <img src="https://upwebinar.cl/mailing/maklube/belen.png" width="130" />
                                                                                                                                                                                    </td>
                                                                                                                                                                                </tr>
                                                                                                                                                                            </table> -->

                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                                style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                                <tr style="padding: 0 0 50px;">
                                                                                                    <td align="center" width="100%">
                                                                                                        Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>
                                                                                    </body>

                                                                                    </html>
                                                                                `
                                                                            };
                                                                            transporter.sendMail(mailOptions, function(error, info){
                                                                                if(error){
                                                                                    res.status(500).send({message: "Error del servidor 0012"});
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                var mailOptions = {
                                                                    from: upEmail,
                                                                    to: userUpdate.email,
                                                                    subject: 'Adhesión Maklube 2021',
                                                                    text: 'Adhesión Maklube 2021',
                                                                    html: `
                                                                    <html>
                                                                        <head>
                                                                            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
                                                                            <title>Maklube</title>
                                                                        </head>

                                                                        <body style="background:#f6f6f6;">
                                                                            <div
                                                                                style="background:#fff;color:#000; width:600px; max-width: 600px; margin: 0 auto; padding: 0;font-family: Montserrat, sans-serif;">

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:10px;margin-bottom:0; background-image: url('https://upcompany.cl/mailing/maklube/041021/mailing/header-maklube.jpg');">
                                                                                    <tr>
                                                                                        <th align="center" width="100%" style="color:#2d2d2d; padding: 10px;"> 
                                                                                            <!-- <img src="./bannerBelen.jpg" width="100%"/> -->
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logo3Belen.png"  width="20%" align="left"/>
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/logoBelenColor.png"  width="30%" align="right"/>
                                                                                        </th>
                                                                                    </tr>
                                                                                </table>
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%" style="color:#000;padding: 50px 0 20px;">
                                                                                            <h3 style="color: #000; font-size: 30px;margin-bottom: 20px;">¡Adhesión exitosa!</h3>
                                                                                            <p style="margin: 0;padding: 0;font-size:16px;color:#000;text-align:center;font-weight: 500;">
                                                                                                Ya estas listo para ser parte de:<br />
                                                                                                <strong>Maklube Fraterno 2021</strong>
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%%" style="padding: 20px 0 20px;color:#000;font-size: 12px;" colspan="3">
                                                                                            Haz recibido una invitación para el Maklube Fraterno 2021. <br/>
                                                                                            Miércoles 10 de Noviembre a las 21:00 hrs. <br/>
                                                                                            Ingresa el correo registrado, que es por el cuál recibiste esta invitación. <br/>
                                                                                            El correo podrá ser ingresado una vez y en un solo dispositivo. Nos vemos!
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>&nbsp;</td>
                                                                                        <td align="center" width="33%" style="padding: 0;">
                                                                                            <p
                                                                                                style="margin: 0 auto 30px;color: #000;font-size: 18px;padding: 10px 0 10px 20px;border: 1px solid #e4c3a0;border-radius: 5px;">
                                                                                                ${userUpdate.email}
                                                                                            </p>
                                                                                        </td>
                                                                                        <td>&nbsp;</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" width="100%%" style="padding: 20px 115px 20px" colspan="3">
                                                                                            <img src="https://upcompany.cl/mailing/maklube/041021/mailing/timer.png" width="100%" />
                                                                                            <p style="border-top: 4px solid #e4c3a0;padding: 40px 0;margin-top: 40px;color: #000;">
                                                                                                Recuerda conectarte 30 minutos antes.
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                    style="margin-top:0;margin-bottom:0;padding: 20px 50px;">
                                                                                    <tr>
                                                                                        <td>
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                                                                                style="margin-top:0;margin-bottom:0;border: 1px solid #e4c3a0;border-radius: 10px;">
                                                                                                <tr>
                                                                                                    <td colspan="2" style="text-align: center;color: #000;font-size: 14px;padding: 20px 0 0;">
                                                                                                        Para no perderte ni un segundo, agrégalo en tu calendario
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Maklube%20Fraterno%202121&dates=20211016T000000Z%2F20211016T020000Z&details=https%3A%2F%2Fmaklube.upwebinar.cl&location=https%3A%2F%2Fmaklube.upwebinar.cl" target="_blank" rel="noopener noreferrer">
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal1.png" width="150" />
                                                                                                        
                                                                                                        </a>
                                                                                                    </td>
                                                                                                    <td align="center" width="50%" style="padding: 20px 50px;">
                                                                                                        <a href="http://upwebinar.cl/mailing/maklube/maklube.ics" target="_blank" rel="noopener noreferrer" className="btn">
                                                                                                        <img src="https://upcompany.cl/mailing/maklube/041021/mailing/cal2.png" width="150" />
                                                                                                        </a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>


                                                                                <!-- <table cellspacing="0" cellpadding="0" border="0" width="600px" style="margin-top:0;margin-bottom:0;">
                                                                                    <tr style="padding: 0 0 50px;">
                                                                                        <td align="center" width="100%" style="padding: 20px 0;">
                                                                                            <img src="https://upwebinar.cl/mailing/maklube/belen.png" width="130" />
                                                                                        </td>
                                                                                    </tr>
                                                                                </table> -->

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="600px"
                                                                                    style="background:#000; color:#fff;margin-bottom:0;padding: 10px 50px;font-size: 10px;">
                                                                                    <tr style="padding: 0 0 50px;">
                                                                                        <td align="center" width="100%">
                                                                                            Este mail es generado de manera automática, Por favor NO RESPONDER.
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </body>

                                                                        </html>
                                                                    `
                                                                };
                                                                transporter.sendMail(mailOptions, function(error, info){
                                                                    if(error){
                                                                        res.status(500).send({message: "Error del servidor 0012"});
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                        res.redirect('https://maklube.upwebinar.cl/confirmacion');
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.redirect('https://maklube.upwebinar.cl/confirmacion');
                }
            }
        }
    });
}

function makePaypalDonation(req, res) {

    var value = req.body.amount;
    var payId = req.body.payId;

    paypal.configure({
        'mode': 'live', // sandbox
        'client_id': 'AVJwEuQ7jqzSlNPnWZxFpYmlkTLkDu3sPpz_ttFxdCzLBIWWt53cupzitgCPKAFA5gujxp2_B4V5M2PS',
        'client_secret': 'EHbdB1KBKGRnEb7IA3sognqv2xEAbaFwqTBKxewIgrYVoBaLzr7YuM6_oeSEy1U4d-Rs5i7PrUbkLMH9'
    });

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `https://maklube.upwebinar.cl/api/v1/catch-donation-paypal/${payId}`,
            "cancel_url": "https://maklube.upwebinar.cl/error-trx"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Maklube",
                    "sku": "001",
                    "price": parseInt(value),
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": parseInt(value)
            },
            "description": "Maklube fraterno"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            const newPayment = new Payment();
            newPayment.paymentId = payId;
            newPayment.user = null;
            newPayment.amount = parseInt(value);
            newPayment.currencyType = 'USD';
            newPayment.income = 'DONACION';
            newPayment.paymentMethod = 'PAYPAL';
            newPayment.save((err, paymentStored) => {
                if (err) {
                    res.status(500).send({ message: "Error de servidor 0015" });
                } else {
                    if (!paymentStored) {
                        res.status(500).send({ message: "Error de servidor 0016" });
                    } else {
                        res.status(200).send({status: 200, response: payment.links});
                    }
                }
            });
        }
    });
}

function catchDonationPaypal(req, res) {
    const params = req.params;

    Payment.findOne({paymentId: params.payId}, (err, paymentStored) => {
        if (err) {
            res.status(500).send({ message: "Error de servidor 0005" });
        } else {
            if (!paymentStored) {
                res.status(500).send({ message: "Error de servidor 0006" });
            } else {
                if (paymentStored.status === 'PENDIENTE') {
                    paymentStored.status = 'COMPLETADO';
                    paymentStored.income = "DONACION"
                    Payment.findByIdAndUpdate({_id: paymentStored.id}, paymentStored, (err, paymentUpdate) => {
                        if (err) {
                            res.status(404).send({message: "Error de servidor 0007"});
                        } else {
                            if (!paymentUpdate) {
                                res.status(500).send({message: "Error del servidor 0008"});
                            } else {
                                res.redirect('https://maklube.upwebinar.cl/confirmacion-donacion');
                            }
                        }
                    });
                } else {
                    res.redirect('https://maklube.upwebinar.cl/confirmacion-donacion');
                }
            }
        }
    });
}

function getPayments(req, res) {
    Payment.find().then(payments => {
        if (!payments) {
            res.status(404).send({message: "No se ha encontrado ningún pago"});
        } else {
            res.status(200).send({payments});
        }
    });
}

module.exports = {
    signInPagoFacil,
    makePay,
    catchCallback,
    makeDonation,
    catchDonation,
    makePayPaypal,
    catchCallbackPaypal,
    makePaypalDonation,
    catchDonationPaypal,
    getPayments
}; 