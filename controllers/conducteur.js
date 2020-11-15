const User = require('../models/user')
const sortTrajet = require('../utils/sortTrajet')
const Trajet = require('../models/trajet')
const moment = require('moment')

exports.getIndex = (req, res, next) => {
    Trajet.find({conducteur:req.session.user._id}).populate('passager').then(trajets => {
        res.render('conducteur/index', {
            pageTitle: 'Espace conducteur',
            trajets: sortTrajet.sortTrajets(trajets),
            moment: moment,
            user:req.session.user
            ,isLoggedIn:req.session.isLoggedIn
        });
    })
}

exports.getDevenirConducteur = (req, res, next) => {
    User.findById(req.session.user._id).then(user=>{
        res.render('devenirConducteur', {
            pageTitle: "Devenir Conducteur",
            user:user
            ,isLoggedIn:req.session.isLoggedIn
        })
    })
}

exports.postVerifierPapiers = (req, res, next) => {
    const uploaded = Object.values(req.files)
    console.log(uploaded)
    var fichiers = uploaded.map(f => {
        return [f[0].fieldname,f[0].location]
    })
    console.log(fichiers)
    User.findById(req.session.user._id).then(user => {
        for(f of fichiers){
            user.papiers[f[0]].statut="en cours de vérification"
            user.papiers[f[0]].lien=f[1]
        }
        req.session.user = user

        user.save()
        res.redirect('/devenir-conducteur')
    })
}

exports.getConfirmationTrajet = (req,res,next) => {
    const trajetId = req.params.trajetId
    Trajet.findById(trajetId).populate('passager').then(trajet => {
        res.render('conducteur/confirmation-trajet.ejs',{
            pageTitle:'Trajet confirmé',
            isLoggedIn:req.session.isLoggedIn,
            trajet:trajet,
            moment:moment
        })
    })
}

exports.getValiderTrajet = (req,res,next) => {
    const trajetId = req.params.trajetId
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Trajet.findById(trajetId).populate('passager').then(trajet => {
        res.render('conducteur/valider-trajet.ejs',{
            pageTitle:'Validez le trajet',
            isLoggedIn:req.session.isLoggedIn,
            trajet:trajet,
            moment:moment,
            message:message
        })
    })
}

exports.postValiderTrajet = (req,res,next) => {
    const trajetId = req.body.trajetId
    const code = req.body.code
    Trajet.findById(trajetId).then(trajet=>{
        if(code == trajet.codeConfirmation){
            trajet.trajetConfirme = true
            trajet.save()
            User.findById(trajet.conducteur).then(user => {
                var newAmount = Number(user.points.gagnes)
                newAmount += 300;
                user.points.gagnes = newAmount
                req.session.user = user
                req.session.save()
                user.save()
                res.redirect('/conducteur/trajet-valide')
            })
        }else{
            req.flash('error', 'Code incorrect, veuillez réessayer');
            res.redirect('/conducteur/valider-trajet/'+trajet._id)
        }
    })
}