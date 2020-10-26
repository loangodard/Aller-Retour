module.exports = (req,res,next) => {
    if(req.session.user.rang !== 'commerce'){
        return res.redirect('/')
    }
    next()
}