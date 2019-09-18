var mongoose = require('mongoose');


var AddressSchema = mongoose.Schema({


    UserID : {
        type: Object ,
        required: true
    },
    Address  : String ,
    Location : String ,
    Type     : String


});


var Address = module.exports = mongoose.model('addresses' , AddressSchema);