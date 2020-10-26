const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  rang: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  papiers: {
    permis: {
      statut: {
        type: String
      }, //Non verifiée; en cours de vérification; vérifié
      lien: {
        type: String
      },
      message: {
        type: String
      }
    },
    assurance: {
      statut: {
        type: String
      }, //Non verifiée; en cours de vérification; vérifié
      lien: {
        type: String
      },
      message: {
        type: String
      }
    }
  },
  points: {
    achetes: {
      type: Number
    },
    gagnes: {
      type: Number
    }
  },
  commerceId: {
    type: String,
    ref:'Commerce'
  }
});

userSchema.methods.getPoints = function (cb) {
  cb(this.points.achetes + this.points.gagnes)
};

module.exports = mongoose.model('User', userSchema);