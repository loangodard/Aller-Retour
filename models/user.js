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
  },
  avis:{
    moyenne:{
      type: Number
    },
    commentaires:[
      {
        note:{type: Number},
        commentaire:{type: String},
        auteur:{type:String, ref:"User"}
      }
    ]
  }

});

userSchema.methods.getPoints = function (cb) {
  cb(this.points.achetes + this.points.gagnes)
};

userSchema.method.nouvelAvis = () => {
  
}

module.exports = mongoose.model('User', userSchema);