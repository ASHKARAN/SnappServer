var mongoose = require('mongoose');
var ForeignKeyHelper = require("../Utils/ForeignKeyHelper");
var Schema = mongoose.Schema;
var AddressSchema = mongoose.Schema({


    UserID : {
        type: Schema.ObjectId ,
        ref : "users",
        validate : {
            isAsync : true ,
            validator : function(v) {
                ForeignKeyHelper(mongoose.model("users" , v))
            }
        },
        required: true
    },
    Address  : String ,
    Location : String ,
    Type     : String


});


var Address = module.exports = mongoose.model('addresses' , AddressSchema);