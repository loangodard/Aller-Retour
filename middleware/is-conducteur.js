const User = require('../models/user')

module.exports = (req,res,next) => {
    User.findById(req.session.user._id).then(user=>{
        if(user.rang == 'conducteur'){
            if(req.session.user.rang !== 'conducteur'){
                req.session.user.rang = 'conducteur'
                req.session.save()
            }
            return next()
        }else{
            res.redirect('/devenir-conducteur')
        }
    })
}