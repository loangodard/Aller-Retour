const Trajet = require('../models/trajet')
const User = require('../models/user')

exports.fetchAll = () => {
    Trajet.find().populate('passager').then(r=>{
        console.log(r)
    })
}