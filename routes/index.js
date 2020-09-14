var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')
const authController = require('../controllers/auth')
const trajetController = require('../controllers/trajets');
const trajet = require('../models/trajet');

/* GET */
router.get('/', indexController.getIndex);
router.get('/inscription',authController.getInscription)
router.get('/connexion',authController.getConnexion)
router.get('/demander-un-trajet',indexController.getDemanderTrajet)
router.get('/trajets',indexController.getVoirTrajets)
router.get('/paiement',indexController.getPaiement)
router.get('/mon-compte',indexController.getMonCompte)
router.get('/modifier-compte',indexController.getModifierCompte)

/*GET Tunnel demande de trajet*/
router.get('/demander-un-trajet/:trajetId/depart',trajetController.getDepart)
router.get('/demander-un-trajet/:trajetId/arrivee',trajetController.getArrivee)
router.get('/demander-un-trajet/:trajetId/date',trajetController.getDate)
router.get('/demander-un-trajet/:trajetId/heure',trajetController.getHeure)
router.get('/demander-un-trajet/:trajetId/passagers',trajetController.getPassagers)
router.get('/demander-un-trajet/:trajetId/confirmer',trajetController.getConfirmer)
router.get('/demander-un-trajet/:trajetId/demande-recue',trajetController.getDemandeRecue)


/* POST */
router.post('/inscription',authController.postInscription)
router.post('/connexion',authController.postConnexion)
router.post('/deconnexion',authController.postLogout)
router.post('/conduire',indexController.postConduire)
router.post('/modifier-compte',indexController.postModifierCompte)

/*POST Tunnel demande de trajet*/
router.post('/demander-un-trajet',trajetController.postDemanderTrajet)
router.post('/demander-le-depart',trajetController.postDepart)
router.post('/demander-arrivee',trajetController.postArrivee)
router.post('/demander-date',trajetController.postDate)
router.post('/demander-heure',trajetController.postHeure)
router.post('/demander-passagers',trajetController.postPassagers)
router.post('/confirmer',trajetController.postConfirmer)

module.exports = router;
