var express = require('express');
var router = express.Router();
const adminControllers = require('../controllers/admin')

/* GET users listing. */
router.get('/', adminControllers.getIndex);

module.exports = router;
