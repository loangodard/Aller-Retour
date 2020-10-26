module.exports = (req,res,next) => {
    if(req.session.user.commerceId === req.params.commerceId){
        return next()
    }
    res.redirect('/commercant')
}