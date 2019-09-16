var mongoose = require('mongoose');


var UsersSchema = mongoose.Schema({

    PhoneNumber : {
        type: String ,
        required: true
    },
    Fname : String ,
    Lname : String ,
    Email : String ,
    LastLoginTime : Date ,
    Online        : Boolean ,
    RegistrationDate : {
        type: Date,
        default : Date.now()
    }

});


var User = module.exports = mongoose.model('users' , UsersSchema);