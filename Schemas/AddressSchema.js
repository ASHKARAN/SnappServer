var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = mongoose.Schema({


    UserID : {
        type: Schema.ObjectId ,
        required: true
    },
    Address  : String ,
    Location : String ,
    Type     : String


});


var Address = module.exports = mongoose.model('addresses' , AddressSchema);