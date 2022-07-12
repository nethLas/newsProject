const nodemailer = require('nodemailer');

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
    //1 Render based on template
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });
    const text =
      template === 'passwordReset'
        ? 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process within ten minutes of receiving it:\n\n' +
          `${this.url}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        : '';
    //define ops
    const mailOptions = {
      from:
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_EMAIL
          : this.from,
      to: this.to,
      subject,
      text,
      //html
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
};
