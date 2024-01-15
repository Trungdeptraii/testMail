var express = require('express');
var router = express.Router();
let sendMail = require('../utils/mail.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/send-mail/:id', (req, res)=>{
  console.log(req.path);
  res.send('ok')
})
router.get('/send-mail',async (req, res)=>{
  const info = await sendMail('toilatrunglv@gmail.com', 'Test NodeMailer'
  );
  console.log('info', info);
  res.send('Gửi email')
})

module.exports = router;
