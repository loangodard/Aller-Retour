var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index')
const authController = require('../controllers/auth')
const trajetController = require('../controllers/trajets');
const conducteurController = require('../controllers/conducteur')
const trajet = require('../models/trajet');
const isAuth = require('../middleware/is-auth')
const isConducteur = require('../middleware/is-conducteur')

/* GET */
router.get('/', indexController.getIndex);
router.get('/inscription',authController.getInscription)
router.get('/connexion',authController.getConnexion)
router.get('/demander-un-trajet',isAuth,indexController.getDemanderTrajet)
router.get('/trajets',isAuth,indexController.getVoirTrajets)
router.get('/paiement',isAuth,indexController.getPaiement)
router.get('/mon-compte',isAuth,indexController.getMonCompte)
router.get('/modifier-compte',isAuth,indexController.getModifierCompte)
router.get('/devenir-conducteur',isAuth,conducteurController.getDevenirConducteur)

/*GET Tunnel demande de trajet*/
router.get('/demander-un-trajet/:trajetId/depart',isAuth,trajetController.getDepart)
router.get('/demander-un-trajet/:trajetId/arrivee',isAuth,trajetController.getArrivee)
router.get('/demander-un-trajet/:trajetId/date',isAuth,trajetController.getDate)
router.get('/demander-un-trajet/:trajetId/heure',isAuth,trajetController.getHeure)
router.get('/demander-un-trajet/:trajetId/passagers',isAuth,trajetController.getPassagers)
router.get('/demander-un-trajet/:trajetId/confirmer',isAuth,trajetController.getConfirmer)
router.get('/demander-un-trajet/:trajetId/demande-recue',isAuth,trajetController.getDemandeRecue)
router.get('/acheter-points',isAuth,indexController.getAcheterPoints)
router.get('/acheter-points/:amount',isAuth,indexController.getAchatPoints)
router.get('/boutique',indexController.getBoutique)


/* POST */
router.post('/inscription',authController.postInscription)
router.post('/connexion',authController.postConnexion)
router.post('/deconnexion',isAuth,authController.postLogout)
router.post('/conduire',isAuth,isConducteur,indexController.postConduire)
router.post('/modifier-compte',isAuth,indexController.postModifierCompte)
router.post('/acheter-points/:amount/success',isAuth,indexController.postCheckoutSuccess)

/*POST Tunnel demande de trajet*/
router.post('/demander-un-trajet',isAuth,trajetController.postDemanderTrajet)
router.post('/demander-le-depart',isAuth,trajetController.postDepart)
router.post('/demander-arrivee',isAuth,trajetController.postArrivee)
router.post('/demander-date',isAuth,trajetController.postDate)
router.post('/demander-heure',isAuth,trajetController.postHeure)
router.post('/demander-passagers',isAuth,trajetController.postPassagers)
router.post('/confirmer',isAuth,trajetController.postConfirmer)

module.exports = router;