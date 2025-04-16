const ContactForm = require('../models/ContactFormModel');
const { contactFormNotificationEmail } = require('../config/nodemailerConfig');

// **1. Send Form Details**
const sendFormDetails = async (req, res) => {
    try {
        const { name, email, mSubject, subject } = req.body;

        // Validate input fields
        if (!name || !email || !mSubject || !subject) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Save submission to the database
        const newSubmission = new ContactForm({
            name,
            email,
            mSubject,
            subject,
        });

        await newSubmission.save();

        // Send notification email to admin
        await contactFormNotificationEmail(name, process.env.EMAIL_USER, mSubject, subject);

        return res.status(201).json({
            message: "Your message has been sent successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in sendFormDetails:", error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};



module.exports = {
    sendFormDetails
};
