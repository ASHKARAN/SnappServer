var mongoose = require('mongoose');
var ForeingKeyHelper = require("../Utils/ForeignKeyHelper");

var AddressSchema = mongoose.Schema({


    UserID : {
        type: Schema.ObjectId ,
        validate : {
            isAsync : true ,
            validator : function(v) {
                ForeingKeyHelper(mongoose.model("users" , v))
            }
        },
        required: true
    },
    Address  : String ,
    Location : String ,
    Type     : String


});


var Address = module.exports = mongoose.model('addresses' , AddressSchema);