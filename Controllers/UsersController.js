var UsersSchema = require('../Schemas/UsersSchema');


exports.Registration = function (req , res) {

    UsersSchema.findOne({} , function (err , data) {
        if(err) {
            res.send({error : true , code : "system_error" , message : "some error happens"});
            return;
        }
        if(data == null) {
            var activationCode = Math.floor(Math.random() * 10000);
            var user = new UsersSchema({PhoneNumber:  req.body.PhoneNumber , ActivationCode : activationCode});
            user.save().then(() =>  res.send({error : false  ,code : "activation" , message : "Activation code sent"} ));
        }
        else {
            res.send({error : true  ,code : "user_already_exists" , message : "user already exists"} )
        }
    });
};

