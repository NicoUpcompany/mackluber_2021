 
var Redirect = require("../models/redirect");
 
 
 
 
function getStatus(req, res) {

    Redirect.find().then(status => {
        if (!status) {
            res.status(404).send({message: "No se ha encontrado ningún estatus"});
        } else {
            console.log(status)
            res.status(200).send({
                redirect: status[0].redirect,
                texto: status[0].texto
            });
        }
    });
}

 
 
 

 
 

module.exports = {
    getStatus
}; 