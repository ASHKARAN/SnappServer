var UsersSchema = require('../Schemas/UsersSchema');


exports.Registration = function (req , res) {

    UsersSchema.findOne({} , function (err , data) {
        if(err) {
            res.send({error : true , message : "some error happens"});
            return;
        }
        if(data == null) {
            res.send({error : false  , message : "let's register this user"} )
        }
        else {
            res.send({error : true  , message : "user already exists"} )
        }
    });
};

