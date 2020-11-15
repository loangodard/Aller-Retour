const Commerce = require('../models/commerce')
const Produit = require('../models/produit')

exports.getIndex = (req, res, next) => {
    var messageSuccess = req.flash('success')
    var messageError = req.flash('error')

    if (messageSuccess.length > 0) {
        messageSuccess = messageSuccess[0];
    } else {
        messageSuccess = null;
    }

    if (messageError.length > 0) {
        messageError = messageError[0];
    } else {
        messageError = null;
    }

    const commerceId = req.session.user.commerceId
    Commerce.findById(commerceId).then(commerce => {
        console.log(commerce)
        Produit.find({
            commerce: commerceId
        }).then(produits => {
            res.render('commerce/index.ejs', {
                pageTitle: "Espace commerçant",
                isLoggedIn: req.session.isLoggedIn,
                commerce: commerce,
                produits: produits,
                success: messageSuccess,
                error: messageError
            })
        })
    })
}

exports.getNouveauProduit = (req, res, next) => {
    res.render('commerce/nouveau-produit.ejs', {
        pageTitle: "Espace commerçant",
        isLoggedIn: req.session.isLoggedIn,
    })
}

exports.getModifierProduit = (req, res, next) => {
    const productId = req.params.productId;
    Produit.findById(productId).then(produit => {
        res.render('commerce/modifier-produit.ejs', {
            pageTitle: 'Modifier le produit',
            isLoggedIn: req.session.isLoggedIn,
            produit: produit
        })
    })
}

var aws = require('aws-sdk');
require('dotenv').config(); // ENV VARIABLE
aws.config.loadFromPath('./s3_config.json');
var s3Bucket = new aws.S3({
    params: {
        Bucket: 'aller-retour-public'
    }
})

exports.postNouveauProduit = (req, res, next) => {
    const titre = req.body.titre
    const description = req.body.desc
    const qte = req.body.qte
    const prix = req.body.prix
    const commerceId = req.session.user.commerceId
    var imgUrl = commerceId + '-produit-' + Date.now().toString()
    //On upload l'image redimensionné et extraite en base64.
    if (req.body.imageBinary) {
        buf = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: 'produits/'+imgUrl,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };
    }
    imgUrl = "https://aller-retour-public.s3.eu-west-3.amazonaws.com/produits/" + imgUrl

    var produit = new Produit();
    produit.commerce = commerceId
    produit.titre = titre
    produit.description = description
    produit.prix = prix
    produit.quantite = qte
    if (!req.body.imageBinary) {
        produit.image = "/images/default.jpg"
    } else {
        s3Bucket.putObject(data, function (err, data) {
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
                produit.image = "/images/default.jpg"
            } else {
                produit.image = imgUrl
                produit.save()
            }
        });
    }
    produit.save()
    return res.redirect('/commercant')
}

exports.postModifierProduit = async (req, res, next) => {
    const productId = req.body.productId
    const titre = req.body.titre
    const description = req.body.desc
    const qte = req.body.qte
    const prix = req.body.prix
    const commerceId = req.session.user.commerceId
    var imgUrl = commerceId + '-produit-' + Date.now().toString()
    var endUrl = imgUrl.slice()
    //On upload l'image redimensionné et extraite en base64.
    if (req.body.imageBinary) {
        buf = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: 'produits/'+imgUrl,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };
    }
    imgUrl = "https://aller-retour-public.s3.eu-west-3.amazonaws.com/produits/" + imgUrl

    if (req.body.imageBinary) {
        s3Bucket.deleteObject({ // NE FONCTIONNE PAS :(
            Key: '/produits/' + req.body.oldImage.split("/produits/").pop()
        }, (err, data) => {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);
        })

        const stored = await s3Bucket.upload(data, function (err, data) {
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
            }
        })
    }
    
    Produit.findById(productId).then(produit => {
        produit.commerce = commerceId
        produit.titre = titre
        produit.description = description
        produit.prix = prix
        produit.quantite = qte
        if (!req.body.imageBinary) {
            produit.image = req.body.oldImage
            return produit.save()
        } else {
            produit.image = imgUrl
            produit.save()
        }
    }).then(r => {
        req.flash('success', 'Produit modifié');
        return res.redirect('/commercant')
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId
    Produit.findByIdAndDelete(productId).then(r => {
        req.flash('success', 'Produit supprimé');
        return res.redirect('/commercant')
    })
}

exports.getCreerCommerce = (req,res,next) => {
    const commerceId = req.params.commerceId;
    res.render('commerce/nouveau-commerce',{
        pageTitle:'Mon commerce',
        isLoggedIn:req.session.isLoggedIn,
        commerceId:commerceId
    })
}

exports.postNouveauCommerce = (req, res, next) => {
    const nom = req.body.nom
    const description = req.body.desc
    const adresse = req.body.adresse
    const cp = req.body.cp
    const ville = req.body.ville
    const horaires = req.body.horaires
    const commerceId = req.session.user.commerceId
    var imgUrl = commerceId + '-commerce-' + Date.now().toString()
    //On upload l'image redimensionné et extraite en base64.
    if (req.body.imageBinary) {
        buf = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: 'commerces/'+imgUrl,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };
    }
    imgUrl = "https://aller-retour-public.s3.eu-west-3.amazonaws.com/commerces/" + imgUrl

    Commerce.findById(commerceId).then(commerce => {
        commerce.nom = nom
        commerce.description = description
        commerce.lieu.adresse = adresse
        commerce.lieu.cp = cp
        commerce.lieu.ville = ville
        commerce.horaires = horaires
        if (!req.body.imageBinary) {
            commerce.image = "/images/default.jpg"
        } else {
            s3Bucket.putObject(data, function (err, data) {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    commerce.image = "/images/default.jpg"
                } else {
                    commerce.image = imgUrl
                    commerce.save()
                }
            });
        }
        commerce.save()
        return res.redirect('/commercant')
    })
}

exports.getModifierCommerce = (req,res,next) => {
    const commerceId = req.params.commerceId
    Commerce.findById(commerceId).then(commerce => {
        res.render('commerce/modifier-commerce',{
            pageTitle : 'Modifier mon Commerce',
            isLoggedIn : req.session.isLoggedIn,
            commerce : commerce
        })
    })
}

exports.postModifierCommerce = (req, res, next) => {
    const nom = req.body.nom
    const description = req.body.desc
    const adresse = req.body.adresse
    const cp = req.body.cp
    const ville = req.body.ville
    const horaires = req.body.horaires
    const commerceId = req.session.user.commerceId
    const olgImg = req.body.oldImage
    var imgUrl = commerceId + '-commerce-' + Date.now().toString()
    //On upload l'image redimensionné et extraite en base64.
    if (req.body.imageBinary) {
        buf = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: 'commerces/'+imgUrl,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };
    }
    imgUrl = "https://aller-retour-public.s3.eu-west-3.amazonaws.com/commerces/" + imgUrl

    Commerce.findById(commerceId).then(commerce => {
        commerce.nom = nom
        commerce.description = description
        commerce.lieu.adresse = adresse
        commerce.lieu.cp = cp
        commerce.lieu.ville = ville
        commerce.horaires = horaires
        if (!req.body.imageBinary) {
            commerce.image = olgImg
        } else {
            s3Bucket.putObject(data, function (err, data) {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    commerce.image = olgImg
                } else {
                    commerce.image = imgUrl
                    commerce.save()
                }
            });
        }
        commerce.save()
        return res.redirect('/commercant')
    })
}