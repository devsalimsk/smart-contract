const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

router.post('/invoke', contractController.invokeContract);

module.exports = router;
