const Trajet = require('../models/trajet')
const trajet = require('../models/trajet')

exports.postDemanderTrajet = (req, res, next) => {
    const userId = req.session.user._id
    const nouveauTrajet = new Trajet({ passager: userId })
    nouveauTrajet.save().then(r => {
        res.redirect('/demander-un-trajet/' + nouveauTrajet._id + '/depart')
    })
}

exports.getDepart = (req, res, next) => {
    const trajetId = req.params.trajetId
    const key = process.env.GOOGLE_API_KEY
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderDepart.ejs', { pageTitle: 'Départ', trajet: traj,GOOGLE_API_KEY:key})
    })
}

exports.postDepart = (req, res, next) => {
    const adresse = req.body.location
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.lieu_depart = adresse
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/arrivee')
    })
}

exports.getArrivee = (req, res, next) => {
    const trajetId = req.params.trajetId
    const key = process.env.GOOGLE_API_KEY
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderArrivee.ejs', { pageTitle: 'Arrivée', trajet: traj,GOOGLE_API_KEY:key })
    })
}

exports.postArrivee = (req, res, next) => {
    const adresse = req.body.location
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.lieu_arrivee = adresse
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/date')
    })
}

exports.getDate = (req, res, next) => {
    const trajetId = req.params.trajetId
    Trajet.findById(trajetId).then(traj => {
        res.render('tunnel-nouveau-trajet/demanderDate.ejs', { pageTitle: 'Date du départ', trajet: traj })
    })
}

exports.postDate = (req, res, next) => {
    const date = req.body.date
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.date = date
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/heure')
    })
}

exports.getHeure = (req, res, next) => {
    const trajetId = req.params.trajetId
    res.render('tunnel-nouveau-trajet/demanderHeure.ejs', { pageTitle: 'Heure', trajetId: trajetId })
}

exports.postHeure = (req, res, next) => {
    const heure = req.body.heure
    const trajetId = req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.heure = heure
        traj.save()
    }).then(r => {
        res.redirect('/demander-un-trajet/' + trajetId + '/passagers')
    })
}

exports.getPassagers = (req, res, next) => {
    const trajetId = req.params.trajetId
    Trajet.findById(trajetId).then(traj=>{
        res.render('tunnel-nouveau-trajet/demanderPassagers.ejs', { pageTitle: 'Nombre de passagers', trajet:traj})
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
        res.render('tunnel-nouveau-trajet/confirmer.ejs', { pageTitle: 'Confirmer ma demande', trajet: traj })
    })
}

exports.postConfirmer = (req,res,next) => {
    const trajetId= req.body.trajetId
    Trajet.findById(trajetId).then(traj => {
        traj.demandeConfirme=true
        traj.save()
        res.redirect('/demander-un-trajet/' + trajetId +'/demande-recue')
    })
}

exports.getDemandeRecue = (req,res,next)=>{
    res.render('tunnel-nouveau-trajet/demandeRecue.ejs',{pageTitle:'Demande reçue'})
}