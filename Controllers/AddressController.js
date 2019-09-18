var AddressSchema = require('../Schemas/AddressSchema');
var jwt = require('jsonwebtoken');

exports.AddNewAddress =  function (req , res) {




    AddressSchema.findOne({PhoneNumber : req.body.PhoneNumber} , function (err , data) {
        if(err) {
            res.status(500).send({error : true , code : "system_error" , message : "some error happens"});
            return;
        }
        if(data == null) {
            var activationCode = Math.floor(Math.random() * 10000);
            var user = new UsersSchema({PhoneNumber:  req.body.PhoneNumber , ActivationCode : activationCode});
            user.save().then(() =>  res.send({error : false  ,code : "activation" , message : "Activation code sent"} ));
        }
        else if(!data.Activated) {
            var activationCode = Math.floor(Math.random() * 10000);
            data.ActivationCode = activationCode ;
            data.save().then(() =>  res.send({error : false  ,code : "activation" , message : "Activation code sent"} ));
        }
        else {
            res.status(500).send({error : true  ,code : "user_already_exists" , message : "user already exists"} )
        }
    });
};

exports.GetAddresses = function (req , res) {

    if(req.body.ActivationCode === 0) {
        res.status(500).send({error : true , code : "wrong_activation_code" , message : "Wrong Activation Code"});
        return;
    }

    AddressSchema.findOne({PhoneNumber : req.body.PhoneNumber } , function (err , data) {
        if(err) {
            res.status(500).send({error : true , code : "system_error" , message : "some error happens"});
            return;
        }
        if(data == null) {
            res.status(500).send({error : true , code : "user_not_found" , message : "User Not Found"});
        }
        else if(data.Activated) {
            res.status(500).send({error : true , code : "user_already_activated" , message : "User Already Activated"});
        }
        else if(data.ActivationCode === req.body.ActivationCode) {
            data.ActivationCode = 0 ;
            data.Activated = true ;

            var token = jwt.sign({data : data}, '123456');

            data.save().then(() => res.send({error : false , code : "success_activation" ,
                    message : "Activation Successfull" , Token : token } ) );
        }
        else {
            res.status(500).send({error : true , code : "wrong_activation_code" , message : "Wrong Activation Code"});

        }
    });
};

