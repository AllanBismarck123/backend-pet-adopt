"use strict";
require('dotenv').config({ path: '.env.cred' });
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 20000,
});

async function sendEmails(ngoName, subject, text, html, destinationEmail, accountMsg) {
  const from =  accountMsg == true ? `Plataforma de adoção de animais <${process.env.EMAIL_USER}}>` :
  `${ngoName} via Plataforma de adoção de animais" <${process.env.EMAIL_USER}}>`;
  
  try {
    const info = await transporter.sendMail({
      from: from,
      to: `${destinationEmail}, allanbismarck95@gmail.com1`,
      subject: subject,
      text: text,
      html: html,
    });
  
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

function afterEmail(ngoName) {
  return `Atenciosamente,
  [Notificador de E - mails]
  [Assistente de Adoção]
  [${ngoName}]`;
}

function afterEmailHtml(ngoName) {
  return `<p>Atenciosamente,<br>
      <em>Notificador de E-mails</em><br>
      <em>Assistente de Adoção</em><br>
      <strong>[${ngoName}]</strong>
  </p>`
}

module.exports = {
    sendEmails,
    afterEmail,
    afterEmailHtml
};