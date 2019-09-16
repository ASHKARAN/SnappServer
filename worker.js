var SCWorker = require('socketcluster/scworker');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');
var bodyparser = require('body-parser');

var mongoose = require('mongoose');
var UsersController = require('./Controllers/UsersController');
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

    app.put("/users" , function(req, res){UsersController.Registration(req, res)});




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
