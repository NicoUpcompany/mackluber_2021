const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require('./config');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/payment");
const questionRoutes = require("./routes/question");
const statsRoutes = require("./routes/stats");
const xlsxRoutes = require("./routes/importXlsx");
const redirect = require("./routes/redirect");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, paymentRoutes);
app.use(`/api/${API_VERSION}`, questionRoutes);
app.use(`/api/${API_VERSION}`, statsRoutes);
app.use(`/api/${API_VERSION}`, xlsxRoutes);
app.use(`/api/${API_VERSION}`, redirect);

module.exports = app;