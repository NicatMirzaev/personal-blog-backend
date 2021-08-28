const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const { MAIL_SERVICE, MAIL_USER, MAIL_PASS } = require("./config");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: MAIL_SERVICE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  })
);

module.exports = transporter;
