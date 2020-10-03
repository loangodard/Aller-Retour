exports.getIndex=(req,res,next)=>{
    res.render('commerce/index.ejs',{
        pageTitle:"Espace commerçant"
    })
}