const ContactForm = require('../models/ContactFormModel');
const { contactFormNotificationEmail } = require('../config/nodemailerConfig');

// **1. Send Form Details**
const sendFormDetails = async (req, res) => {
    try {
        const { name, email, mobileNumber, subject } = req.body;

        // Validate input fields
        if (!name || !email || !mobileNumber || !subject) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Save submission to the database
        const newSubmission = new ContactForm({
            name,
            email,
            mobileNumber,
            subject,
        });

        await newSubmission.save();

        // Send notification email to admin
        await contactFormNotificationEmail(name, email, mobileNumber, subject);

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

// **2. Get Contact Form Submissions**
const getContactFormSubmissions = async (req, res) => {
    try {
        const submissions = await ContactForm.find().sort({ createdAt: -1 });

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({
                message: "No contact form submissions yet",
            });
        }

        return res.status(200).json({
            message: "Contact form submissions fetched successfully",
            data: submissions,
        });
    } catch (error) {
        console.error("Error in getContactFormSubmissions:", error.message);
        return res.status(500).json({
            message: "Internal server error! Please try again.",
        });
    }
};

module.exports = {
    sendFormDetails,
    getContactFormSubmissions
};
