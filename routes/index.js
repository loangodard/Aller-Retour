var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')

/* GET home page. */
router.get('/', indexController.getIndex);
router.get('/inscription',indexController.getInscription)
router.get('/connexion',indexController.getConnexion)
router.get('/demander-un-trajet',indexController.getDemanderTrajet)
router.get('/trajets',indexController.getVoirTrajets)
router.get('/paiement',indexController.getPaiement)
router.get('/mon-compte',indexController.getMonCompte)



module.exports = router;
