module.exports = (req,res,next) => {
    if(req.session.user.rang !== 'conducteur'){
        return res.redirect('/devenir-conducteur')
    }
    next()
}