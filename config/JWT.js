const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const ejs = require('ejs')
require('dotenv').config()




const transferEmail_details = nodemailer.createTransport({
  host: process.env.smtpserver,
  port: process.env.smtpserver_Port,
  secure: false, // use TLS
  auth: {
    user: process.env.AdminEmail,
    pass: process.env.AdminPassword
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
})
var token = ''

//you have to set the values for whom you are sending email and second is the html object value
var nodemailer_Option =
{
  from: `"Voip A2Z "<${process.env.AdminEmail}>`,
  to: '',
  subject: '',
  text: '',
  html: ''
}
//here we are recieveing user as a JSON in which there will be  Full Name and Email address
function generateToken_And_SendMail(user) {
  token = jwt.sign(user, process.env.privateKey, { expiresIn: '1h' })
  ejs.renderFile('views/emailTemplates/verification_email.ejs', {
    verify_token: `${process.env.localhost_address}/verifyToken?Authorization=Bearer%20${token}`
    , username: user.Fullname
  }, (error, file) => {
    if (error)
      console.log(error)
    else
      sendmail_Config(file, user.userEmail, 'Email Verification')
  })
  return token
}

function sendmail_Config(file, email, subject) {
  nodemailer_Option.to = email
  nodemailer_Option.html = file
  nodemailer_Option.subject = subject

  transferEmail_details.sendMail(nodemailer_Option, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info, 'Message sent: ');
    }
  });

}

function verifyToken(req, res, next) {
  const temp = req.query.Authorization
  if (typeof temp !== 'undefined') {
    const splited = temp.split(' ')
    const temp1 = splited[1]
    req.token = temp1
    next()
  } else {
    console.log('Error')
    res.sendStatus(403)
  }
}

module.exports = { transferEmail_details, nodemailer_Option, generateToken_And_SendMail, jwt, verifyToken, sendmail_Config }