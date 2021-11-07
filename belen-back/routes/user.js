const express = require("express");
const UserController = require("../controllers/user");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.post("/sign-out", UserController.signOut);
api.post("/sign-in-admin", UserController.signInAdmin);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.post("/users2", [md_auth.ensureAuth], UserController.getUsers2);
api.post("/update-cortesia-code", [md_auth.ensureAuth], UserController.updateCortesiaCode);
api.put("/update-user/:id", [md_auth.ensureAuth], UserController.updateUser);
api.post("/cortesia-codes", [md_auth.ensureAuth], UserController.generateCortesiaCodes);
api.post("/update-waiting-room", [md_auth.ensureAuth], UserController.updateWaitingRoomTime);
api.post("/update-stream", [md_auth.ensureAuth], UserController.updateStreamTime);

module.exports = api;