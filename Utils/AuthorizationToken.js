var jwt = require('jsonwebtoken');


exports.Decrypt = async function (Authorization) {

    return new Promise( (resolve , reject) => {
        jwt.verify(Authorization, '123456', function(err, user) {

            if(err) {
                return reject();
            }
            else {
                return resolve(user.data);
            }
        });
    });

};