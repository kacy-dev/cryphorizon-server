const express = require('express');
const router = express.Router();
const {
    sendFormDetails
    // getContactFormSubmissions
} = require('../controllers/contactController');


// const { protectAdmin } = require('../middlewares/authMiddleware'); // ProtectAdmin remains

router.post('/contact', sendFormDetails);
// router.get('/getDetails', getContactFormSubmissions);

module.exports = router;
