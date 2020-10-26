var express = require('express');
var router = express.Router();
const commerceControllers = require('../controllers/commerce')
const isCommerce = require('../middleware/is-commerce')
const isMyShop = require('../middleware/is-my-shop')
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')


require('dotenv').config(); // ENV VARIABLE

var s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  Bucket: process.env.AWS_BUCKET_NAME,
  region: "eu-west-3",
  ACL: 'public-read'
})

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME + "/produits/",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, req.session.user._id.toString() + ' produit ' + Date.now().toString())
    }
  })
})


router.get('/',isCommerce, commerceControllers.getIndex);
router.get('/:commerceId/ajouter-produit',isCommerce,isMyShop,commerceControllers.getNouveauProduit)
router.get('/:commerceId/modifier-produit/:productId',isCommerce,isMyShop,commerceControllers.getModifierProduit)
router.get('/:commerceId/creer-commerce',isCommerce,isMyShop,commerceControllers.getCreerCommerce)
router.get('/:commerceId/modifier-commerce',isCommerce,isMyShop,commerceControllers.getModifierCommerce)

router.post('/nouveau-produit', upload.array('product-image',1),commerceControllers.postNouveauProduit)
router.post('/nouveau-commerce', upload.array('product-image',1),commerceControllers.postNouveauCommerce)
router.post('/supprimer-produit',commerceControllers.postDeleteProduct)
router.post('/modifier-produit', upload.array('product-image',1),commerceControllers.postModifierProduit)
router.post('/modifier-commerce',upload.array('product-image',1),commerceControllers.postModifierCommerce)

module.exports = router;
