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

exports.GetAddresses = async function (req , res) {

    var User = await AuthorizationToken.Decrypt(req.get("Authorization"));
    AddressSchema.find({UserID : User._id } , function (err , data) {
        if(err) {
            res.status(500).send({error : true , code : "system_error" , message : "some error happens"});
            return;
        }
        res.send(data);
    });
};
exports.DeleteAddress = async function (req , res) {

    var User = await AuthorizationToken.Decrypt(req.get("Authorization"));

    AddressSchema.findOneAndDelete({_id : req.body.AddressID } , function (err , data) {
        if(err) {
            res.status(500).send({error : true , code : "system_error" , message : "some error happens"});
            return;
        }
        res.send({error : false , code : "success" , message : "Address removed"});

    });
};

