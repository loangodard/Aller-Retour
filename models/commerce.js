const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commerceSchema = new Schema({
    userId:{type:String,ref:'User'},
    lieu:{
        adresse:{
            type:String
        },
        cp:{
            type:String
        },
        ville:{
            type:String
        }
    },
    image:{
        type:String
    },
    nom:{
        type:String
    },
    description:{
        type:String
    },
    horaires:{type:String},
    produits:[{ type : String, ref: 'Produit' }]
});

module.exports = mongoose.model('Commerce', commerceSchema);