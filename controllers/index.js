const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    res.render('index', { pageTitle: 'Aller-Retour' });
}

exports.getConnexion = (req, res, next) => {
    res.render('connexion', { pageTitle: 'Connexion' });
}

exports.getInscription = (req, res, next) => {
    res.render('inscription', { pageTitle: 'Inscription' });
}

exports.getMonCompte = (req, res, next) => {
    res.render('monCompte', { pageTitle: 'Mon Compte' });
}

exports.getPaiement = (req, res, next) => {
    res.render('paiement', { pageTitle: 'Paiement' });
}

exports.getDemanderTrajet = (req, res, next) => {
    res.render('demanderTrajet', { pageTitle: 'Demander un trajet' });
}

exports.getVoirTrajets = (req, res, next) => {
    res.render('voirTrajets', { pageTitle: 'Les trajets' });
}
