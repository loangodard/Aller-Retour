var express = require('express');
var router = express.Router();
const conducteurControllers = require('../controllers/conducteur')
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
const isConducteur = require('../middleware/is-conducteur')
const isConducteurOfThisTrajet = require('../middleware/is-conducteur-of-this-trajet')
const isAuth = require('../middleware/is-auth')

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
    bucket: process.env.AWS_BUCKET_NAME + "/papiers-conducteurs",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, req.session.user._id.toString() + '-' + Date.now().toString() + ".pdf")
    }
  })
})

/* GET */
router.get('/',isAuth,isConducteur, conducteurControllers.getIndex);
router.get('/confirmation-trajet/:trajetId',isAuth,isConducteur,isConducteurOfThisTrajet,conducteurControllers.getConfirmationTrajet)
router.get('/valider-trajet/:trajetId',isAuth,isConducteur,isConducteurOfThisTrajet,conducteurControllers.getValiderTrajet)
router.get('/trajet-valide',isAuth,isConducteur,conducteurControllers.getTrajetValide)

/* POST */
router.post('/devenirConducteurVerification', upload.fields([{name: 'permis'},{name: 'assurance'}]), conducteurControllers.postVerifierPapiers)
router.post('/valider-trajet',conducteurControllers.postValiderTrajet)

module.exports = router;