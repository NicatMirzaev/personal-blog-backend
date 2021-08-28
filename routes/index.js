const express = require("express");
const router = express.Router();
const validator = require("email-validator");
const transporter = require("../lib/mail");
const { MAIL_USER } = require("../lib/config");
const { INVALID_SYNTAX, EMPTY, INVALID_EMAIL } = require("../lib/error-codes");

/* GET home page. */
router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (
    name === undefined ||
    email === undefined ||
    subject === undefined ||
    message === undefined
  )
    return res.status(400).send(INVALID_SYNTAX);
  if (name.length < 1 || subject.length < 1 || message.length < 1)
    return res.status(400).send(EMPTY);
  if (!validator.validate(email)) return res.status(400).send(INVALID_EMAIL);
  const mailOptions = {
    from: email,
    to: MAIL_USER,
    subject: `${name}, ${email} - ${subject}`,
    text: message,
  };
  transporter.sendMail(mailOptions);
  return res.status(200).send({ success: true });
});

module.exports = router;
