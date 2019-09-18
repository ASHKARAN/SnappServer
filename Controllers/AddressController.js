var AddressSchema = require('../Schemas/AddressSchema');
var jwt = require('jsonwebtoken');
var AuthorizationToken = require("../Utils/AuthorizationToken");



exports.AddNewAddress =  async function (req , res) {


    var User = await AuthorizationToken.Decrypt(req.get("Authorization"));

    req.body.UserID = User._id ;
    var Address = new AddressSchema(req.body);
    Address.save().then(() => {
        res.send({error : false , code : "success" , message : "Address Saved"});
    }, function (err) {
        res.status(500).send({error : true , code : "failed" , message : "Address not saved"});
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

