
'use strict';

const mongoose = require('mongoose');
const config = require('../../config');
const mongo = config.mongo

mongoose.Promise = require('bluebird');
mongoose.connect(mongo.uri);

const Schema = mongoose.Schema;
const db = mongoose.connection;

db.on('error',console.error.bind(console,'Connection error'));

db.once('open',function(){
	console.log("mongo connected");
});

const OrderSchema = new mongoose.Schema({
	customerId:{type: Schema.ObjectId, ref:'Customer', default: ''},
  driverId:{type: Schema.ObjectId, ref:'Driver', default: ''},
  requestedOn:{type:Date, default: Date.now()},
  acceptedOn:{type:Date, default: Date.now()},
  completedOn:{type:Date, default: Date.now()},
  status:{
    type:String,
    enum:["expired", "complete", "canceled", "pending", "ongoing", "waiting"],
    default:"waiting"
  }
},{
    collection:mongo.order
});

const DriverSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	mobile: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
  location:{
    city:{ type: String },
    pin:{ type: Number },
    lat:{ type: Number },
    lng:{ type: Number }
  }
  status:{
    type:String,
    enum:["available", "accepted", "onTheWay", "booked"],
    default: "available"
  }
},{
    collection:mongo.driver
});

const CustomerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	mobile: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
  location:{
    city:{ type: String },
    pin:{ type: Number },
    lat:{ type: Number },
    lng:{ type: Number }
  }
},{
    collection:mongo.customer
});

const Driver = mongoose.model(mongo.driver, DriverSchema);
const Customer = mongoose.model(mongo.customer, CustomerSchema);
const Order = mongoose.model(mongo.order, OrderSchema);

module.exports = {
	Driver:Driver,
  Customer:Customer,
  Order:Order
};
