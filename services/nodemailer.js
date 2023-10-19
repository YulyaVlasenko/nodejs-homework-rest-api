const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "vlasenkodevelop@meta.ua",
    pass: META_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "vlasenkodevelop@meta.ua" };
  await transport
    .sendMail(email)
    .then((data) => console.log(data))
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;