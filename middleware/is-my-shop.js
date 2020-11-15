const User = require('../models/user')

module.exports = (req,res,next) => {
    User.findById(req.session.user._id).then(user => {
        if(user.commerceId === req.params.commerceId){
            next()
        }else{
            res.redirect('/commercant')
        }
    })
}