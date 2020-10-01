const User = require('../models/user')

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: "Espace Administrateur"
    })
}

exports.getVerifierPapiers = (req, res, next) => {
    User.find({
        rang: 'passager'
    }, (err, docs) => {
        if (err) {
            console.log(err)
            return res.redirect('/')
        }

        const users = docs.filter(user => {
            return (user.papiers.permis.statut !== "non envoyé" && user.papiers.assurance.statut !== "non envoyé")
        })
        res.render('admin/verifier-papiers', {
            pageTitle: "Verification des papiers",
            users: users
        })
    })
}

exports.getVerifierPapiersUser = (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId).then(user => {
        res.render('admin/verifier-papiers-user', {
            pageTitle: user.prenom + " " + user.nom,
            user: user
        })
    })
}

exports.postVerifierPapiersUser = (req, res, next) => {
    const userId = req.body.userId
    User.findById(userId).then(user => {
        const pressed = req.body.bouton
        if (pressed === 'renvoyer-permis') {
            const message = req.body['message-permis'];
            user.papiers.permis.message = message
            user.papiers.permis.statut = 'à renvoyer'
        } else if (pressed === 'vérifié-permis') {
            user.papiers.permis.statut = 'vérifié'
        } else if (pressed === 'renvoyer-assurance') {
            const message = req.body['message-assurance'];
            user.papiers.assurance.message = message
            user.papiers.assurance.statut = 'à renvoyer'
        } else if (pressed === 'vérifié-assurance') {
            user.papiers.assurance.statut = 'vérifié'
        }
        user.save()
        return res.redirect('/admin/verifier-papiers/'+userId)
    })
}

exports.postPromouvoirConducteur = (req,res,next) => {
    const userId = req.body.userId
    User.findById(userId).then(user=>{
        user.rang = 'conducteur';
        user.save()
        res.redirect('/admin/verifier-papiers')
    })
}