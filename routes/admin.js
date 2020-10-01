var express = require('express');
var router = express.Router();
const adminControllers = require('../controllers/admin')

/* GET users listing. */
router.get('/', adminControllers.getIndex);
router.get('/verifier-papiers',adminControllers.getVerifierPapiers)
router.get('/verifier-papiers/:userId',adminControllers.getVerifierPapiersUser)


/*POST*/
router.post('/verifier-papier-user',adminControllers.postVerifierPapiersUser)
router.post("/promouvoir-conducteur",adminControllers.postPromouvoirConducteur)

module.exports = router;
