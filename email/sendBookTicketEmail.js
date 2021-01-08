const nodemailer = require('nodemailer');
const hogan = require('hogan.js');
const fs = require('fs');
const config = require('../config/index');
const template = fs.readFileSync(`${__dirname}/sendBookTicketEmail.hjs`, 'utf-8')
const compiledTemplate = hogan.compile(template)
module.exports.sendBookTicketEmail = (email) => {
    const transport = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        requireSSL: true,
        auth: {
            user: 'ngo.dhuy177@gmail.com',
            pass: '01688665335Huy'
        }
    }
    const transporter = nodemailer.createTransport(transport)
    const mailOptions = {
        from: 'ngo.dhuy177@gmail.com',
        to: email,
        subject: 'Booked',
        html: compiledTemplate.render({
            email: email
        })
    }
    transporter.sendMail(mailOptions, err => {
        if (err) return console.log(err)
        console.log('Successful');
    })
}
