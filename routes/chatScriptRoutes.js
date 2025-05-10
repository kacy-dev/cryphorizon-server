const express = require('express');
const router = express.Router();
const {
  createScript,
  getScript,
  updateScript,
  toggleScript,
  deleteScript,
  serveScript
} = require('../controllers/chatScriptController');

router.post('/smartsupp', createScript);
router.get('/smartsupp', getScript);
router.put('/smartsupp', updateScript);
router.patch('/smartsupp/toggle', toggleScript);
router.delete('/smartsupp', deleteScript);
router.get('/smartsupp-script.js', serveScript); // Public script endpoint

module.exports = router;
