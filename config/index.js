'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

//TODO: To change secret session key
var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '../../'),
  port: process.env.PORT || 3000,
  ip: process.env.IP || '0.0.0.0',
  secrets: {
    session: 'basic-node-server-web-secret'
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

var environment = process.env.NODE_ENV || 'development';

module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + environment + '.js') || {});
