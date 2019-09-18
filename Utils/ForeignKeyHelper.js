module.exports = function(model , v) {


    return new Promise((resolve , reject) => {
        model.findOne({_id : v} , (err , data) =>{
            if(err) reject(false);
            resolve(true);
        })
    });


}