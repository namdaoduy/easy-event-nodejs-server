const nodemailer = require('nodemailer')

class _Mailer {
  constructor() {
    this.USER = 'dev.namdaoduy@gmail.com';
    this.PASS = process.env.EE_MAIL_PASS || "";
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.USER,
        pass: this.PASS
      }
    });
  }

  sendVerifyEmail(user, link) {
    let mailOptions = {
      from: `Easy Event <${this.USER}>`,
      to: user.email,
      subject: 'Xác nhận email đăng ký tham gia sự kiện',
      text: `Easy Event chào bạn! Hãy truy cập link sau để xác nhận email đăng ký tham gia sự kiện: ${link}`,
      html: `<b>Easy Event chào ${user.name}!</b><br/>
      Hãy truy cập link sau để xác nhận email đăng ký tham gia sự kiện: <br/>
      <a href="${link}">${link}</a>`
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log("-----x---> Sent error")
      console.log("---------> Sent!");
    })
  }

  sendTicketEmail(user, dataImage) {
    let mailOptions = {
      from: `Easy Event <${this.USER}>`,
      to: user.email,
      subject: 'Vé tham gia sự kiện từ Easy Event',
      text: `Easy Event chào bạn! Chúc mừng bạn đã đăng ký thành công tham gia sự kiện! Nếu không thấy dữ liệu vé, vui lòng xem email trên PC hoặc smartphone`,
      html: `<b>Easy Event chào ${user.name}!</b><br/>
      Chúc mừng bạn đã đăng ký thành công tham gia sự kiện! <br/>
      Đây là thông tin vé của bạn trong đính kèm <br/>
      <img src="cid:${this.USER}"/>`,
      attachments:[{
        filename: "ticket.png",
        href: dataImage
      }],
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log("-----x---> Sent error")
      console.log("---------> Sent!");
    })
  }
}

const Mailer = new _Mailer();
module.exports = Mailer;