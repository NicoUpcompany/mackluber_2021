const mongoose = require("mongoose");
const cron = require('node-cron');
const PagoFacil = require("./controllers/payment");
const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");
var server = require('http').createServer(app);
var io = require('socket.io')(server);

cron.schedule('0 */8 * * *', function(){
  PagoFacil.signInPagoFacil();
});

let users = [];
let cont = 0;

io.origins('*:*');
io.on('connection', (socket) => {

    socket.on('NEW_USER', code => {

        const newUser = {
            id: socket.id,
            code: code
        };
        if (users.length > 0) {
            for(var i = 0; i < users.length; i++) {
                if (users[i].code === newUser.code) {
                    io.to(users[i].id).emit('DISCONNECT_USER')
                    users = users.filter(u => u.code !== users[i].code);
                    users.push(newUser);
                    cont = cont + 1;
                }
            }
        }
        if (cont === 0) {
            users.push(newUser);
        }
        socket.emit('GET_USER_INFO', newUser);
        io.emit('UPDATE_USER_LIST', users);
        cont = 1;
    });
});

const port = process.env.PORT || 8080;

mongoose.set("useFindAndModify", false);
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/belen`, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err) {
        throw err;
    } else {
        server.listen(port, function() {
            console.log("--------------------------------");
            console.log("|          Belen 2000          |");
            console.log("--------------------------------");
            console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
        });
    }
});
