const bcrypt = require('bcryptjs');
const User = require('../models/user')

exports.getConnexion = (req, res, next) => {
    res.render('connexion', { pageTitle: 'Connexion' });
}

exports.getInscription = (req, res, next) => {
    res.render('inscription', { pageTitle: 'Inscription' });
}

exports.postConnexion = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
        //   req.flash('error', 'Invalid email or password.');
        console.log('error : invalid email ou mpd')
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
            // req.flash('error', 'Invalid email or password.');
            console.log('error : invalid email ou mpd')
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
    const email = req.body.email;
    const nom = req.body.nom
    const prenom = req.body.prenom
    const tel = req.body.tel
    const password = req.body.password;
    const confirmPassword = req.body.repeatPassword;
    User.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
        //   req.flash('error', 'E-Mail exists already, please pick a different one.');
        console.log('error : email exists already')
          return res.redirect('/inscription');
        }
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              tel:tel,
              nom:nom,
              prenom:prenom,
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
  