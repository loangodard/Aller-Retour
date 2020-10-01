const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    res.render('conducteur/index', {
        pageTitle: "Espace conducteur"
    })
}

exports.getDevenirConducteur = (req, res, next) => {
    User.findById(req.session.user._id).then(user=>{
        res.render('devenirConducteur', {
            pageTitle: "Devenir Conducteur",
            user:user
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
