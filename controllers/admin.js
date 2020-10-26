const User = require('../models/user')
const Commerce = require('../models/commerce')

exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: "Espace Administrateur",
        isLoggedIn: req.session.isLoggedIn
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
            users: users,
            isLoggedIn: req.session.isLoggedIn
        })
    })
}

exports.getVerifierPapiersUser = (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId).then(user => {
        res.render('admin/verifier-papiers-user', {
            pageTitle: user.prenom + " " + user.nom,
            user: user,
            isLoggedIn: req.session.isLoggedIn
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
        return res.redirect('/admin/verifier-papiers/' + userId)
    })
}

exports.postPromouvoirConducteur = (req, res, next) => {
    const userId = req.body.userId
    User.findById(userId).then(user => {
        user.rang = 'conducteur';
        user.save()
        res.redirect('/admin/verifier-papiers')
    })
}

exports.getPromouvoirCommercant = (req, res, next) => {
    var messageSuccess = req.flash('success')
    var messageError = req.flash('error')

    if (messageSuccess.length > 0) {
        messageSuccess = messageSuccess[0];
    } else {
        messageSuccess = null;
    }

    if (messageError.length > 0) {
        messageError = messageError[0];
    } else {
        messageError = null;
    }
    res.render('admin/promouvoir-commercant', {
        pageTitle: "Promouvoir commerçant",
        isLoggedIn: req.session.isLoggedIn,
        error: messageError,
        success: messageSuccess
    })
}

exports.postPromouvoirCommercant = (req, res, next) => {
    const mail = req.body.mail
    User.findOne({
        email: mail
    }).then(user => {
        if (!user) {
            req.flash('error', 'Cet utilisateur n\'existe pas');
        } else if (user.rang === 'commerce') {
            req.flash('error', 'Cet utilisateur est déjà commerçant');
        } else {
            commerce.userId = user._id
            commerce.save()
            const commerce = new Commerce()
            user.rang = "commerce"
            user.commerceId = commerce._id
            user.save()
            req.flash('success', 'Utilisateur promu commerçant');
        }
        res.redirect('/admin/promouvoir-commercant')
    })
}