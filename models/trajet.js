const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trajetSchema = new Schema({
    passager:{type:String,ref:'User'},
    lieu_depart:{
        ville:{type:String},
        adresse:{type:String},
        cp:{type:String}
    },
    lieu_arrivee:{
        ville:{type:String},
        adresse:{type:String},
        cp:{type:String}
    },
    date:{type:String},
    nombrePassagers:{type:Number},
    conducteur:{type:String,ref:'User'},
    demandeConfirme:{type:Boolean},
    codeConfirmation:{type:String},
    trajetConfirme:{type:Boolean} 
})

module.exports = mongoose.model('Trajet', trajetSchema);