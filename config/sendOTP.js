const transporter = require("../services/emailService");
require('dotenv').config();
const { contactFormNotificationTemplate } =  require("../services/emailUtility");
{
  /* <img style="display:block;max-height:28px;width:auto" src="https://ci3.googleusercontent.com/meips/ADKq_NYnR8RrmEzTcdA_g5Wr5k3yGyWcQa7B0pdz4QGMHupkoSK_3L7ylD-Qlb9op06QnpLKPjIES1rtsBX98vWs-rHnTXwY=s0-d-e1-ft#https://s.udemycdn.com/email/logo-udemy-v3.png" alt="Udemy" width="75" class="CToWUd" data-bit="iit"> */
}

const sendOTPEmail = (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `
    <div style="color:#1c1d1f;margin:0;font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:400;line-height:1.4">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9fa;padding:24px">
            <tbody><tr>
                <td>&nbsp;</td>
                <td width="600">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff">
                        
                            <tbody>
                            <tr>
                                <td style="border-bottom:1px solid #cccccc;padding:24px">
                                    <h2>Cryphorizon</h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:24px 24px 0 24px">
                                        <p>
                                          <a style="text-decoration:none;color:#1c1d1f">
                                                    Hi ${name},
                                          </a>
                                        </p>
                                        <p>
                                          <a style="text-decoration:none;color:#1c1d1f"></a>
                                        </p>
                                            <p>
                                              <a style="text-decoration:none;color:#1c1d1f">Use the code below to complete registration.</a>
                                            </p>
                                            <p>
                                            </p>
                                            <p style="margin-bottom:0">
                                                <a style="text-decoration:none;color:#1c1d1f"></a>
                                            </p>
                                                <h1 style="background-color:#d3d3d352;text-align:center">
                                                <a style="text-decoration:none;color:#1c1d1f">${otp}</a></h1><a style="text-decoration:none;color:#1c1d1f"></a><p><a style="text-decoration:none;color:#1c1d1f"></a><a style="text-decoration:none;color:#1c1d1f">This code expires in 10 minutes.</a>
                                                </p><a style="text-decoration:none;color:#1c1d1f"></a><p><a style="text-decoration:none;color:#1c1d1f"></a>
                                                </p>
                                            <p></p>
                                </td>
                            </tr>
                        <tr>
                            <td style="padding:48px 24px 0 24px">
                                <p style="font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:12px;font-weight:400;line-height:1.4;color:#6a6f73;margin:0">
                                        Delivered by CRYPHORIZON team.
                                   
                                </p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding:24px 0 0 0"></td>
                        </tr>
                    </tbody>
                    </table>
                </td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
        </table>
  
     
    `,
  };

  //   <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border: 1px solid #ddd;">
  //   <h2 style="color: #333; text-align: center; text-transform: uppercase;">Investment site</h2>
  //   <p style="text-align: center;">To complete registration input the OTP in the area provided.</p>
  //   <p style="font-size: 16px; color: #555; text-align: center;">
  //     Your OTP code is
  //     <strong style="font-size: 18px;">${otp}</strong>
  //     <br>
  //     <span style="font-size: 16px; color: #555; text-align: center;">It will expire in <strong>10</strong> minutes.</span>
  //   </p>
  // </div>
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};


const contactFormNotification = (name, email, mSubject, subject) => {
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Form Submission From - ${name}`,
    html: `
    <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    color: #4CAF50;
                }
                .content {
                    padding: 10px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .info-block {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border-left: 4px solid #4CAF50;
                }
                .info-block p {
                    margin: 5px 0;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="header">New Contact Form Submission</h1>
                <div class="content">
                    <p>Hello Admin,</p>
                    <p>You have received a new contact form submission. Below are the details:</p>
                    <div class="info-block">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Mobile Number:</strong> ${mSubject}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <p>Please follow up with the user as soon as possible to address their query.</p>
                    <p>Best Regards</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Cryphorizon. All rights reserved.</p>
                </div>
            </div>
        </body>
    `,
  };

  //   <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border: 1px solid #ddd;">
  //   <h2 style="color: #333; text-align: center; text-transform: uppercase;">Investment site</h2>
  //   <p style="text-align: center;">To complete registration input the OTP in the area provided.</p>
  //   <p style="font-size: 16px; color: #555; text-align: center;">
  //     Your OTP code is
  //     <strong style="font-size: 18px;">${otp}</strong>
  //     <br>
  //     <span style="font-size: 16px; color: #555; text-align: center;">It will expire in <strong>10</strong> minutes.</span>
  //   </p>
  // </div>
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully: " + info.response);
    }
  });
};

// const contactFormNotificationEmail = async (name, email, mSubject, subject) => {
//   const mailOptions = {
//       from: email,
//       to: process.env.EMAIL_USER,
//       subject: `New Form Submission From - ${name}`,
//       html: contactFormNotificationTemplate(name, email, mSubject, subject),
//   };

//   await sendMail(process.env.EMAIL_USER, `New Form Submision From - ${name}`, contactFormNotificationTemplate(name, email, mSubject, subject));
// };


module.exports = sendOTPEmail, contactFormNotification;
