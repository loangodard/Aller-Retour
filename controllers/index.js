const User = require('../models/user')
const Trajet = require('../models/trajet')
const moment = require('moment');
const sortTrajet = require('../utils/sortTrajet')

exports.getIndex = (req, res, next) => {
    res.render('index', { pageTitle: 'Aller-Retour' });
}

exports.getMonCompte = (req, res, next) => {
    const userId = req.session.user._id
    User.findById(userId).then(user => {
        res.render('monCompte', { pageTitle: 'Mon Compte', user: user });
    })
}

exports.getModifierCompte = (req, res, next) => {
    const userId = req.session.user._id
    User.findById(userId).then(user => {
        res.render('editerCompte', { pageTitle: 'Éditer mon Compte', user: user });
    })
}

exports.postModifierCompte = (req, res, next) => {
    const newNom = req.body.nom
    const newPrenom = req.body.prenom
    const newTel = req.body.tel
    const newEmail = req.body.email.toLowerCase()
    const userId = req.body.userId
    User.findOne({ email: newEmail }).then(user => {
        if (user) {
            if (user._id != userId) {
                req.flash('error', 'Cette adresse email est déjà utilisé');
                console.log('error')
                return res.redirect('/modifier-compte');
            }
        }
        User.findById(userId).then(user => {
            user.nom = newNom
            user.prenom = newPrenom
            user.tel = newTel
            user.email = newEmail
            user.save()
        }).then(r => {
            res.redirect('/mon-compte')
        })
    })
}

exports.getPaiement = (req, res, next) => {
    res.render('paiement', { pageTitle: 'Paiement' });
}

exports.getDemanderTrajet = (req, res, next) => {
    res.render('demanderTrajet', { pageTitle: 'Demander un trajet' });
}

exports.getVoirTrajets = (req, res, next) => {
    Trajet.find().populate('passager').then(trajets => {
        res.render('voirTrajets', {
            pageTitle: 'Les trajets',
            trajets: sortTrajet.sortTrajets(trajets),
            moment: moment
        });
    })
}

exports.postConduire = (req, res, next) => {
    const conducteurId = req.session.user._id
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.conducteur = conducteurId
        traj.save()
    }).then(r => {
        res.redirect('/')
    })
}
