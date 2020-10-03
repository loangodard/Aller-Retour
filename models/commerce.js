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
    Photo:{
        type:String
    },
    description:{
        type:String
    },
    horaires:[String],
    produits:[{ type : ObjectId, ref: 'Produit' }]


});

module.exports = mongoose.model('Commerce', commerceSchema);