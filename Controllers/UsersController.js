


exports.test = function (req , res) {

    res.send({
        message : "OK"
    });
};

exports.Registration = function(req , res) {

    res.send(req.body);
};