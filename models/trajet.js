const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trajetSchema = new Schema({
    passager:{type:String},
    lieu_depart:{type:String},
    lieu_arrivee:{type:String},
    date:{type:String},
    nombrePassagers:{type:Number},
    conducteur:{type:String},
    demandeConfirme:{type:Boolean}
})

module.exports = mongoose.model('Trajet', trajetSchema);