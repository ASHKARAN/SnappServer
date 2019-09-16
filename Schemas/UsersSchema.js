var mongoose = require('mongoose');


var UsersSchema = mongoose.Schema({

    PhoneNumber : {
        type: String ,
        unique : true ,
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
    },
    ActivationCode : Number ,
    Activated      : {
        type: Boolean ,
        default:  false
    }

});


var User = module.exports = mongoose.model('users' , UsersSchema);