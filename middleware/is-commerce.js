module.exports = (req,res,next) => {
    User.findById(req.session.user._id).then(user=>{
        if(user.rang == 'commerce'){
            if(req.session.user.rang !== 'commerce'){
                req.session.user.rang = 'commerce'
                req.session.save()
            }
            return next()
        }else{
            res.redirect('/')
        }
    })
}