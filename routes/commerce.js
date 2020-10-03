var express = require('express');
var router = express.Router();
const commerceControllers = require('../controllers/commerce')


router.get('/', commerceControllers.getIndex);


module.exports = router;
