const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  prenom:{
      type: String,
      required: true
  },
  tel:{
      type:String,
      required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
      type:String,
      required:true
  }
});


userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);