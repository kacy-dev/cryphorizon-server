// const nodemailer = require('nodemailer');

// // Create the transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Generate OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000)

// // Email templates
// const templates = {
//     registration: (otp, firstName, companyName) => `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <div style="text-align: center; padding: 20px; background-color: #f4f4f4;">
//                 <h1 style="color: #007BFF;">Welcome to ${companyName}!</h1>
//             </div>
//             <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//                 <h2 style="color: #007BFF;">Hi ${firstName || 'User'},</h2>
//                 <p>Thank you for registering with us. Use the OTP below to verify your account:</p>
//                 <div style="text-align: center; margin: 20px 0;">
//                     <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</span>
//                 </div>
//                 <p>This OTP is valid for 15 minutes. Please complete your registration.</p>
//                 <p>If you did not register, please ignore this email or contact support immediately.</p>
//             </div>
//             <div style="text-align: center; margin-top: 20px; color: #777;">
//                 <p>Best regards,<br>${companyName}</p>
//             </div>
//         </div>
//     `,
//     forgotPassword: (otp, firstName, companyName) => `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <div style="text-align: center; padding: 20px; background-color: #f4f4f4;">
//                 <h1 style="color: #007BFF;">Reset Your Password</h1>
//             </div>
//             <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//                 <h2 style="color: #007BFF;">Hi ${firstName || 'User'},</h2>
//                 <p>You have requested to reset your password. Use the OTP below:</p>
//                 <div style="text-align: center; margin: 20px 0;">
//                     <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</span>
//                 </div>
//                 <p>This OTP is valid for 15 minutes. Please reset your password promptly.</p>
//                 <p>If you did not request this, please ignore this email or contact support.</p>
//             </div>
//             <div style="text-align: center; margin-top: 20px; color: #777;">
//                 <p>Best regards,<br>${companyName}</p>
//             </div>
//         </div>
//     `,
//     resendOtp: (otp, firstName, companyName) => `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//             <div style="text-align: center; padding: 20px; background-color: #f4f4f4;">
//                 <h1 style="color: #007BFF;">Proceed With Verification with the OTP</h1>
//             </div>
//             <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//                 <h2 style="color: #007BFF;">Hi ${firstName || 'User'},</h2>
//                 <p>You have requested for a new OTP. Use the OTP below:</p>
//                 <div style="text-align: center; margin: 20px 0;">
//                     <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</span>
//                 </div>
//                 <p>This OTP is valid for 15 minutes. Please continue with the verification.</p>
//                 <p>If you did not request this, please ignore this email or contact support.</p>
//             </div>
//             <div style="text-align: center; margin-top: 20px; color: #777;">
//                 <p>Best regards,<br>${companyName}</p>
//             </div>
//         </div>
//     `,
// };

// // Send email function
// const sendEmail = async (to, subject, otp, firstName, templateType) => {
//     try {
//         const companyName = 'Your Company Name';
//         const html = templates[templateType](otp, firstName, companyName);

//         const info = await transporter.sendMail({
//             from: `"${companyName}" <${process.env.EMAIL_USER}>`,
//             to,
//             subject,
//             html,
//         });

//         console.log('Email sent:', info.response);
//     } catch (error) {
//         console.error('Error sending email:', error.message);
//         throw new Error('Failed to send email');
//     }
// };

// module.exports = { sendEmail, generateOtp };

const nodemailer = require('nodemailer');
const generateOtp = require('../utilities/otpGenerator');

const {
    adminRegistrationTemplate,
    userRegistrationTemplate,
    otpForgotPasswordTemplate,
    resendOtpTemplate,
    contactFormNotificationTemplate
} = require('../utilities/emailUtility');

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
        from: "Codewave",
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

// Mail Options for User Registration Email
const sendUserRegistrationEmail = async (email, firstName, otp) => {
    const mailOptions = {
        from: '"Didi\'s Fashion" <support@didisfashion.com>',
        to: email,
        subject: 'Welcome to Didi\'s Fashion!',
        html: userRegistrationTemplate(firstName, otp),
    };

    await sendMail(email, 'Welcome to Didi\'s Fashion!', userRegistrationTemplate(firstName, otp));
};

// Mail Options for Admin Registration Email
const sendAdminRegistrationEmail = async (email, username) => {
    const mailOptions = {
        from: "Codewave",
        to: email,
        subject: 'Admin Registration for Portfolio',
        html: adminRegistrationTemplate(username),
    };

    await sendMail(email, 'Admin Registration For portfolio', adminRegistrationTemplate(username));
};

// Mail Options for Resend OTP Email
const sendResendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: '"Didi\'s Fashion" <support@didisfashion.com>',
        to: email,
        subject: 'Your New OTP - Didi\'s Fashion',
        html: resendOtpTemplate(otp),
    };

    await sendMail(email, 'Your New OTP - Didi\'s Fashion', resendOtpTemplate(otp));
};

// Mail Options for Forgot Password OTP Email
const sendForgotPasswordOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: '"Didi\'s Fashion" <support@didisfashion.com>',
        to: email,
        subject: 'Forgot Password OTP - Didi\'s Fashion',
        html: otpForgotPasswordTemplate(otp, firstName),
    };

    await sendMail(email, 'Forgot Password OTP - Didi\'s Fashion', otpForgotPasswordTemplate(otp, firstName));
};

const contactFormNotificationEmail = async (name, email, mobileNumber, subject) => {
    const mailOptions = {
        from: "Codewave",
        to: process.env.EMAIL_USER,
        subject: 'New Form Submission - Codewave',
        html: contactFormNotificationTemplate(name, email, mobileNumber, subject),
    };

    await sendMail(process.env.EMAIL_USER, `New Contact Form Submision - ${name}`, contactFormNotificationTemplate(name, email, mobileNumber, subject));
};

// Exporting all functions to be used in the controllers
module.exports = {
    sendUserRegistrationEmail,
    sendAdminRegistrationEmail,
    sendResendOtpEmail,
    sendForgotPasswordOtpEmail,
    contactFormNotificationEmail,
};


