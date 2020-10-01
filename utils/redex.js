exports.isGoodDate=(dt)=>{
    var reGoodDate = /^((0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/](19|20)?[0-9]{2})*$/;
    return reGoodDate.test(dt);
}