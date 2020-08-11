const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    res.render('index', { pageTitle: 'Aller-Retour' });
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
