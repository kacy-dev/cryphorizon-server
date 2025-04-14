const contactFormNotificationTemplate = (name, email, mobileNumber, subject) => {
    return `
        <html>
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
                        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <p>Please follow up with the user as soon as possible to address their query.</p>
                    <p>Best Regards</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Codewave. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};


module.exports = {
    contactFormNotificationTemplate
};