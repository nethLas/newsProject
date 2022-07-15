const nodemailer = require('nodemailer');
const fs = require('fs');
const { htmlToText } = require('html-to-text');

const tempVerify = fs.readFileSync(
  `${__dirname}/templates/verify.html`,
  'utf-8'
);
const tempReset = fs.readFileSync(
  `${__dirname}/templates/resetPassword.html`,
  'utf-8'
);
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Nethanel Lasry <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    //1)Create transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
        //activate in gmail 'less secure app' option
      },
    });
  }

  async send(template, subject) {
    const temp = template === 'passwordReset' ? tempReset : tempVerify;
    const html = temp.replace(/{%URL%}/, this.url);
    //define ops
    const mailOptions = {
      from:
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_EMAIL
          : this.from,
      to: this.to,
      subject,
      html: html,
      text: htmlToText(html),
    };
    //send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token valid for only ten minutes'
    );
  }

  async sendUserActivation() {
    await this.send(
      'userActivation',
      'Your Activation token valid for only 30 minutes'
    );
  }
};
