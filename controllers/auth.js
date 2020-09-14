const bcrypt = require('bcryptjs');
const User = require('../models/user')

exports.getConnexion = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('connexion', {
        pageTitle: 'Connexion',
        errorMessage: message
    });
}

exports.getInscription = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('inscription', {
        pageTitle: 'inscription',
        errorMessage: message
    });
}

exports.postConnexion = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Email ou mot de passe invalide');
                return res.redirect('/connexion');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Email ou mot de passe invalide');
                    res.redirect('/connexion');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/connexion');
                });
        })
        .catch(err => console.log(err));
};

exports.postInscription = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const nom = req.body.nom
    const prenom = req.body.prenom
    const tel = req.body.tel
    const password = req.body.password;
    const confirmPassword = req.body.repeatPassword;
    if(password !== confirmPassword){
        req.flash('error', 'Les mots de passes sont différents')
        return res.redirect('/inscription')
    }
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Cette email est déjà utilisé, veuillez en utiliser un autre');
                return res.redirect('/inscription');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        tel: tel,
                        nom: nom,
                        prenom: prenom,
                        password: hashedPassword,
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/connexion');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
