var express = require('express');
var router = express.Router();
const conducteurControllers = require('../controllers/conducteur')
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

/* GET users listing. */
router.get('/', conducteurControllers.getIndex);


/* POST */
router.post('/devenirConducteurVerification', upload.fields([{name: 'permis'},{name: 'assurance'}]), conducteurControllers.postVerifierPapiers)

module.exports = router;