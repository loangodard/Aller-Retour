const User = require('../models/user')
const Trajet = require('../models/trajet')
const moment = require('moment');

const randomId = require('../utils/randomId')
const sortTrajet = require('../utils/sortTrajet')

require('dotenv').config(); // ENV VARIABLE

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
console.log()


exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Aller-Retour',
        isLoggedIn: req.session.isLoggedIn,
        points: req.session.user.points.gagnes + req.session.user.points.achetes
    });
}

exports.getMonCompte = (req, res, next) => {
    const userId = req.session.user._id
    User.findById(userId).then(user => {
        res.render('monCompte', {
            pageTitle: 'Mon Compte',
            user: user,
            isLoggedIn: req.session.isLoggedIn
        });
    })
}

exports.getModifierCompte = (req, res, next) => {
    const userId = req.session.user._id
    User.findById(userId).then(user => {
        res.render('editerCompte', {
            pageTitle: 'Éditer mon Compte',
            user: user,
            isLoggedIn: req.session.isLoggedIn
        });
    })
}

exports.postModifierCompte = (req, res, next) => {
    const newNom = req.body.nom
    const newPrenom = req.body.prenom
    const newTel = req.body.tel
    const newEmail = req.body.email.toLowerCase()
    const userId = req.body.userId
    User.findOne({
        email: newEmail
    }).then(user => {
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
    res.render('paiement', {
        pageTitle: 'Paiement',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.getDemanderTrajet = (req, res, next) => {
    res.render('demanderTrajet', {
        pageTitle: 'Demander un trajet',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.getVoirTrajets = (req, res, next) => {
    Trajet.find().populate('passager').then(trajets => {
        res.render('voirTrajets', {
            pageTitle: 'Les trajets',
            trajets: sortTrajet.sortTrajets(trajets),
            moment: moment,
            user: req.session.user,
            isLoggedIn: req.session.isLoggedIn
        });
    })
}

exports.postConduire = (req, res, next) => {
    const conducteurId = req.session.user._id
    const codeConfirmation = randomId.makeid(5)
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.conducteur = conducteurId
        traj.codeConfirmation = codeConfirmation
        traj.trajetConfirme = false
        traj.save()
    }).then(r => {
        res.redirect('/conducteur/confirmation-trajet/'+trajetId)
    })
}

exports.getAcheterPoints = (req, res, next) => {
    res.render('acheter-points', {
        pageTitle: 'Acheter des points',
        isLoggedIn: req.session.isLoggedIn
    })
}

exports.getAchatPoints = async (req, res, next) => {
    const amount = Number(req.params.amount)
    console.log(amount)
    if ([500, 1000, 2000].includes(amount)) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            description: amount + ' points Aller-Retour',
            statement_descriptor: amount + ' points'
        })
        res.render('page-achat', {
            userMail: req.session.user.email,
            client_secret: paymentIntent.client_secret,
            stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
            pageTitle: 'Acheter des points',
            isLoggedIn: req.session.isLoggedIn,
            amount: amount,
            userId: req.session.user._id
        })
    } else {
        res.redirect('/acheter-points')
    }
}

exports.postCheckoutSuccess = (req, res, next) => {
    const amount = Number(req.body.amount)
    const userId = req.body.userId
    User.findById(userId).then(user => {
        var newAmount = Number(user.points.achetes)
        newAmount += amount
        user.points.achetes = newAmount
        user.save()
        req.session.user = user
        req.session.save()
        res.redirect('/');
    })

}

exports.getBoutique = (req,res,next) => {
    res.render('boutique',{
        pageTitle:'Boutique',
        isLoggedIn:req.session.isLoggedIn
    })
}