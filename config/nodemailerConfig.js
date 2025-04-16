

const nodemailer = require('nodemailer');

const {
    contactFormNotificationTemplate
} = require('../services/emailUtility');

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to send emails
const sendMail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: email,
        to,
        subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


const contactFormNotificationEmail = async (name, email, mSubject, subject) => {
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Form Submission - Codewave',
        html: contactFormNotificationTemplate(name, email, mSubject, subject),
    };

    await sendMail(process.env.EMAIL_USER, `New Contact Form Submision - ${name}`, contactFormNotificationTemplate(name, email, mSubject, subject));
};

// Exporting all functions to be used in the controllers
module.exports = {
    contactFormNotificationEmail
};


