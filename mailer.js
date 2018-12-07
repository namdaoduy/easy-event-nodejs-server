const nodemailer = require('nodemailer')

const USER = 'dev.namdaoduy@gmail.com';
const PASS = process.env.EE_MAIL_PASS || "";

class _Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: USER,
        pass: PASS
      }
    });
  }

  sendVerifyEmail(user, link) {
    let mailOptions = {
      from: `Easy Event <${USER}>`,
      to: user.email,
      subject: 'Xác nhận email đăng ký tham gia sự kiện',
      text: `Easy Event chào bạn! Hãy truy cập link sau để xác nhận email đăng ký tham gia sự kiện: ${link}`,
      html: `<b>Easy Event chào ${user.name}!</b><br/>
      Hãy truy cập link sau để xác nhận email đăng ký tham gia sự kiện: <br/>
      <a href="${link}">${link}</a>`
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error)
      console.log(info);
    });
  }
}

const Mailer = new _Mailer();
module.exports = Mailer;