const Trajet = require('../models/trajet')

module.exports = (req,res,next) => {
    Trajet.findById(req.params.trajetId).then(trajet => {
        if(trajet.conducteur == req.session.user._id){
            return next()
        }else{
            return res.redirect('/')
        }
    })
}