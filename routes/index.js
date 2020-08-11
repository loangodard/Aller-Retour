var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')
const authController = require('../controllers/auth')

/* GET */
router.get('/', indexController.getIndex);
router.get('/inscription',authController.getInscription)
router.get('/connexion',authController.getConnexion)
router.get('/demander-un-trajet',indexController.getDemanderTrajet)
router.get('/trajets',indexController.getVoirTrajets)
router.get('/paiement',indexController.getPaiement)
router.get('/mon-compte',indexController.getMonCompte)

/* POST */
router.post('/inscription',authController.postInscription)
router.post('/connexion',authController.postConnexion)
router.post('/deconnexion',authController.postLogout)



module.exports = router;
