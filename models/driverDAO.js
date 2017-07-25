
'use strict';

const Promise = require('bluebird');
const _ = require('lodash')
const mongooseFactory = require('./mongooseFactory');
const Drivers = mongooseFactory.Driver;

class DriverRepo {

    insertManyDrivers(drivers) {
      Drivers.insertMany(drivers, function(err, docs){
        if(err){
          return err;
        }else{
          return docs;
        }
      });
    };

    addOrUpdateDriver(data) {
        let query = {
            email: data.email,
            mobile: data.mobile
        };
        let updateObj = {
            $set: {
                name: data.name,
                email: data.email,
                mobile: data.monile
            }
        };
        return Drivers.update(query, updateObj, {upsert: true});
    };

    getAllDrivers() {
        return Drivers.find();
    };

    getDriver(driverId) {
        let query = {
            _id: driverId
        }
        return Drivers.findOne(query);
    }

}



//TODO::Remove this TEST CODE before push

var data = [
  {
    name:"driver1",
    email:"driver1@gmail.com",
    mobile:9999999901,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:1,
      lng:2
    }
  },
  {
    name:"driver2",
    email:"driver2@gmail.com",
    mobile:9999999902,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:4,
      lng:3
    }
  },
  {
    name:"driver3",
    email:"driver3@gmail.com",
    mobile:9999999903,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:2,
      lng:2
    }
  },
  {
    name:"driver4",
    email:"driver4@gmail.com",
    mobile:9999999904,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:3,
      lng:2
    }
  },
  {
    name:"driver5",
    email:"driver5@gmail.com",
    mobile:9999999905,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:4,
      lng:1
    }
  }
  ]

new DriverRepo().insertManyDrivers(data).then(function(dataResp){
    console.log(dataResp, "dataResppppp")
});

module.exports = DriverRepo;
