"use strict";

var client = require('ibmiotf');
var cloudant = require('./myCloudant.js');

// only for health check
var http = require('http');
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});
// Listen on port 8000
server.listen(8000);


var config;
if(process.env.IOTF){
    console.log('IOTF Env Var set:');
    config = JSON.parse(process.env.IOTF);
}
else {
    config = require("./.ibmiotf.json");
    console.log('IOTF Local config');
}

var cloudantUrl;
if(process.env.CLOUDANT_URL){
  cloudantUrl = process.env.CLOUDANT_URL;
}
else {
  cloudantUrl = require('./.cloudant.json').url;
}

var Bottleneck = require("bottleneck"); // Skip when browser side
// Never more than 1 request running at a time.
// Wait at least 250ms between each request.
// keep the free Cloudant plan happy max 10 request/second
var limiter = new Bottleneck(1, 500);

var deviceType = "BME280";
var appClient = new client.IotfApplication(config);
appClient.connect();
appClient.on("connect", function () {

        console.log("Connected");
        appClient.subscribeToDeviceEvents(deviceType);
});

appClient.on("error", function () {
        console.error();('Could not connect to IOTF');
        process.exit();
});

function savePayload(payload,cb){
  cloudant.initConnection(cloudantUrl,function(err,res){
  if(err){
      console.error('Error connecting to db' + err);
      cb(err,null);
  }
  else{
    cloudant.createDoc(payload,function(err,res){
      if(err){
        console.error(err);
        cb(err,null);
      }
      else{
        console.log('sensor data saved');
        cb(null,'sensor data saved');
      }
      cloudant.closeConnection(function(err,res){
        if(err){
          console.error('error closing Connection: ' + err);
          cb(err,'Error closing Connection');
        }
        else{
          console.log('Connection closed');
          cb(null,'Connection closed')
        }
      });
    });
  }
});
}
appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
    var realPayload = JSON.parse(payload.toString());
    limiter.submit(savePayload, realPayload,function(err,res){
    });
});
