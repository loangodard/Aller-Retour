const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const produitSchema = new Schema({
    commerce:{
        type:String,
        ref:"Commerce"
    },
    titre:{
        type:String
    },
    description:{
        type:String
    },
    prix:{
        type:Number
    },
    quantite:{
        type:Number
    },
    image:{
        type:String
    }
});

module.exports = mongoose.model('Produit', produitSchema);