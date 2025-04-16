const express = require('express');
const router = express.Router();
const {
    sendFormDetails
} = require('../controllers/contactController');


// const { protectAdmin } = require('../middlewares/authMiddleware'); // ProtectAdmin remains

router.post('/contact', sendFormDetails);

module.exports = router;
