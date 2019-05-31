const nodemailer = require('nodemailer');
require('../.config/config.json');
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAILER,
        pass: process.env.MPASS
    }
});
 module.exports = {
    sendMail: function (options, user) {
        'use strict';
        transporter.sendMail(options, function (err, info) {
            if (err) {return console.log(err);}
            console.log(`${user} message %s sent: %s `, info.messageId, info.response);
        });
    }
};
