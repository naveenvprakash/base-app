
'use strict';

const Promise = require('bluebird');
const _ = require('lodash')
const mongooseFactory = require('./mongooseFactory');
const Customers = mongooseFactory.Customer;

class CustomerRepo {

    insertManyCustomers(custs) {
      Customers.insertMany(custs, function(err, docs){
        if(err){
          return err;
        }else{
          return docs;
        }
      });
    };

    addOrUpdateCustomer(data) {
        let query = {
            email: data.email,
            mobile: data.mobile
        };
        let updateObj = {
            $set: {
                name: data.name,
                email: data.email,
                mobile: data.monile,
                location:data.location
            }
        };
        return Customers.update(query, updateObj, {upsert: true});
    };

    getAllCustomers() {
        return Customers.find();
    };

    getCustomer(CustomerId) {
        let query = {
            _id: CustomerId
        }
        return Customers.findOne(query);
    }

}

var data = {
    name:"customer1",
    email:"customer1@gmail.com",
    mobile:8888888888,
    location:{
      city: "bangalore",
      pin: 560066,
      lat:0,
      lng:0
    }
  }


new CustomerRepo().addOrUpdateCustomer(data).then(function(dataResp){
    console.log(dataResp, "dataResppppp")
});

module.exports = CustomerRepo;
