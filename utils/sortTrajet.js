const moment = require('moment')

exports.sortTrajets = (trajets) => {
    //Tri par date et elimine les dates passées
    moment.locale('fr')
    const result = trajets.slice()
    result.sort((a,b) => moment(a.date, "DD/MM/YYYY").diff(moment(b.date, "DD/MM/YYYY"))) // On tri par date
    return result
}
