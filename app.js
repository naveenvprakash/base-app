var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('base-app:server');
var http = require('http');
var config = require('./config');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = http.createServer(app);


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Connect to MongoDB
var options = { promiseLibrary: require('bluebird') }; // TODO:: put this options in config;
mongoose.createConnection(config.mongo.uri, options);
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.connect(config.mongo.uri, { promiseLibrary: require('bluebird'),useMongoClient: true })
    .then(function(){console.log('MongoDB connection established' )})
    .catch(function(err){
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log("Express server running on PORT:" + port );
}

/**
 * environment
 */

 if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  } else if(app.get('env') === 'production'){
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  }

/**
 * Listen on provided port, on all network interfaces.
 */
console.log("IP:"+ config.port, "PORT:"+ config.ip, "CONSOLING IP AND PORT HERE....");

function startServer() {
  server.listen(config.port, config.ip);
  server.on('error', onError);
  server.on('listening', onListening);
}
// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function () {
    console.log("Received kill signal, shutting down gracefully.");
    server.close(function () {
        console.log("Closed out remaining connections.");
        process.exit();
    });

    // if after
    setTimeout(function () {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit();
    }, 10 * 1000);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

startServer();
