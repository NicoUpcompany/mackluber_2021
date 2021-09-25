const express = require("express");
const PaymentController = require("../controllers/payment");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/make-pay", PaymentController.makePay);
api.post("/catch-payment", PaymentController.catchCallback);
api.post("/make-donation", PaymentController.makeDonation);
api.post("/catch-donation", PaymentController.catchDonation);
api.post("/make-pay-paypal", PaymentController.makePayPaypal);
api.post("/make-donation-paypal", PaymentController.makePaypalDonation);
api.get("/catch-payment-paypal/:id", PaymentController.catchCallbackPaypal);
api.get("/catch-donation-paypal/:payId", PaymentController.catchDonationPaypal);
api.get("/get-payments", [md_auth.ensureAuth], PaymentController.getPayments);

module.exports = api;