const mongoose = require('mongoose');

const ContactFormModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
            // match: [/^\\+?[0-9]{10,15}$/, 'Invalid mobile number format'],
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

const ContactForm = mongoose.model('Contact', ContactFormModel);

module.exports = ContactForm;
