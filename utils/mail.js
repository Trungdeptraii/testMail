const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //host của mail server
    port: 465, //port
    secure: true, //
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "chundeptraii@gmail.com", //username
      pass: "esdx uhva jqnm ufnk", //password
    },
  });
const sendMail =async (to, subject, message)=>{
    const info = await transporter.sendMail({
        from: 'F8 <chundeptraii@gmail.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html: '<a href="./send-mail/1">Click Me</a> <img src="http://localhost:3000/images/image.JPG">', // html body
    });
    return info
}
module.exports = sendMail
//esdx uhva jqnm ufnk