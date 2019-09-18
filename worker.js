var SCWorker = require('socketcluster/scworker');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var UsersController = require('./Controllers/UsersController');
var AddressController = require('./Controllers/AddressController');
class Worker extends SCWorker {
  run() {
    console.log('   >> Worker PID:', process.pid);
    var environment = this.options.environment;

    var app = express();

    var httpServer = this.httpServer;
    var scServer = this.scServer;

    if (environment === 'dev') {
      // Log every HTTP request.
      // See https://github.com/expressjs/morgan for other available formats.
      app.use(morgan('dev'));
    }

    mongoose.connect("mongodb://localhost/Snapp" , {useNewUrlParser : true});
    var db = mongoose.connection;

    if(!db)
      console.log("Database Connection error");
    else console.log("Database is Available");


    app.use(serveStatic(path.resolve(__dirname, 'public')));
    app.use(bodyparser.json());

    app.put("/users" ,  (req, res) => {UsersController.Registration(req, res)});
    app.post("/users/activation" ,  (req, res) => {UsersController.Activation(req, res)});
    app.put("/addresses" , VerifyToken,   (req, res) => {AddressController.AddNewAddress(req , res)});
    app.get("/addresses" , VerifyToken,   (req, res) => {AddressController.GetAddresses(req , res)});



    function VerifyToken(req , res , next) {

      jwt.verify(req.get("Authorization"), '123456', function(err, decoded) {
        if(err) {
          res.status(500).send({error : true  ,code : "wrong_token" , message : "Wrong token"} )
        }
        else {
           next();
        }
      });
    }

    // Listen for HTTP GET "/health-check".
    healthChecker.attach(this, app);

    httpServer.on('request', app);

    /**
     * NOTE: Be sure to replace the following sample logic with your own logic.
     */


    var count = 0;
    // Handle incoming websocket connections and listen for events.
    scServer.on('connection', function (socket) {

      socket.on('sampleClientEvent', function (data) {
        count++;
        console.log('Handled sampleClientEvent', data);
        scServer.exchange.publish('sample', count);
      });

      var interval = setInterval(function () {
        socket.emit('random', {
          number: Math.floor(Math.random() * 5)
        });
      }, 1000);

      socket.on('disconnect', function () {
        clearInterval(interval);
      });

    });

  }
}

new Worker();
