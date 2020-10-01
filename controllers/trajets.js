const Trajet = require('../models/trajet')
const trajet = require('../models/trajet')
const moment = require('moment')
const redex = require('../utils/redex')

//moment(date, "DD/MM/YYYY hh")

exports.postDemanderTrajet = (req, res, next) => {
    const userId = req.session.user._id
    const nouveauTrajet = new Trajet({
        passager: userId,
        demandeConfirme: false
    })
    nouveauTrajet.save().then(r => {
        res.redirect('/demander-un-trajet/' + nouveauTrajet._id + '/depart')
    })
}

exports.getDepart = (req, res, next) => {
    const trajetId = req.params.trajetId
    const key = process.env.GOOGLE_API_KEY
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderDepart.ejs', {
            pageTitle: 'Départ',
            trajet: traj,
            GOOGLE_API_KEY: key
        })
    })
}

exports.postDepart = (req, res, next) => {
    const ville = req.body.ville
    const adresse = req.body.adresse
    const cp = req.body.cp
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.lieu_depart.ville = ville
        traj.lieu_depart.adresse = adresse
        traj.lieu_depart.cp = cp
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/arrivee')
    })
}

exports.getArrivee = (req, res, next) => {
    const trajetId = req.params.trajetId
    const key = process.env.GOOGLE_API_KEY
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderArrivee.ejs', {
            pageTitle: 'Arrivée',
            trajet: traj,
            GOOGLE_API_KEY: key
        })
    })
}

exports.postArrivee = (req, res, next) => {
    const ville = req.body.ville
    const adresse = req.body.adresse
    const cp = req.body.cp
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.lieu_arrivee.ville = ville
        traj.lieu_arrivee.adresse = adresse
        traj.lieu_arrivee.cp = cp
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/date')
    })
}

exports.getDate = (req, res, next) => {
    const trajetId = req.params.trajetId
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderDate.ejs', {
            pageTitle: 'Date du départ',
            trajet: traj,
            errorMessage:message
        })
    })
}

exports.postDate = (req, res, next) => {
    var date = req.body.date
    const trajetId = req.body.trajetId
    if (!redex.isGoodDate(date)) {
        req.flash('error', 'La date doit être au format "jj/mm/aaaa"')
        return res.redirect('/demander-un-trajet/'+trajetId+'/date')
    }
    Trajet.findById(trajetId).then(traj => {
        traj.date = date
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/heure')
    })
}

exports.getHeure = (req, res, next) => {
    const trajetId = req.params.trajetId
    res.render('tunnel-nouveau-trajet/demanderHeure.ejs', {
        pageTitle: 'Heure',
        trajetId: trajetId
    })
}

exports.postHeure = (req, res, next) => {
    const heure = req.body.heure
    const trajetId = req.body.trajetId
    var date;
    Trajet.findById(trajetId).then(traj => {
        // moment(date, "DD/MM/YYYY hh")
        date = traj.date + " " + heure, "DD/MM/YYYY hh"
        traj.date = date
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/passagers')
    })
}

exports.getPassagers = (req, res, next) => {
    const trajetId = req.params.trajetId
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderPassagers.ejs', {
            pageTitle: 'Nombre de passagers',
            trajet: traj
        })
    })
}

exports.postPassagers = (req, res, next) => {
    const passagers = req.body.nombrePassagers
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.nombrePassagers = passagers
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/confirmer')
    })
}

exports.getConfirmer = (req, res, next) => {
    const trajetId = req.params.trajetId
    console.log(trajetId)
    Trajet.findById(trajetId).then(traj => {
        console.log(traj)
        res.render('tunnel-nouveau-trajet/confirmer.ejs', {
            pageTitle: 'Confirmer ma demande',
            trajet: traj
        })
    })
}

exports.postConfirmer = (req, res, next) => {
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.demandeConfirme = true
        traj.save()
        res.redirect('/demander-un-trajet/' + trajetId + '/demande-recue')
    })
}

exports.getDemandeRecue = (req, res, next) => {
    res.render('tunnel-nouveau-trajet/demandeRecue.ejs', {
        pageTitle: 'Demande reçue'
    })
}