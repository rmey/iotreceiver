"use strict";

var ClientIoT = require('ibmiotf');

// ****************************
// My Modules
var Cloudant  = require('./own_modules/customCloudant.js');
var cloudant  = new Cloudant('sensordata');
var CustomIoT = require('./own_modules/customIoT.js');
var GetBluemixVCAP = require('./own_modules/getBluemixVCAP.js');
var getBluemixVCAP = new GetBluemixVCAP();
var cloudant_service_name = "";
var iot_service_name = "";

// only for health check
var http = require('http');
console.log('>>> Set server');
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("iotreceiver Server is running\n");
});
// Listen on port 8000 or Cloud provided Port
// this is only to enable frequent health checking in Containers or CF
var port = (process.env.PORT || 8000);
server.listen(port);

// Configure Credentials
// =====================
// - IoT Service
console.log('>>> Configure Services Credentials for the application');
var config;
if(process.env.IOTF){
    console.log('>>> Using Environment varibale IOTF:', JSON.stringify(process.env.IOTF));
    config = JSON.parse(process.env.IOTF);
}

if(getBluemixVCAP.getServiceCredentialsIoT().org){
  config = {
              "org": getBluemixVCAP.getServiceCredentialsIoT().org,
              "id": "IOT_NODE_JS_APPLICATION",
              "auth-key": getBluemixVCAP.getServiceCredentialsIoT().apiKey,
              "auth-token": getBluemixVCAP.getServiceCredentialsIoT().apiToken,
              "type" : "shared"
            }
  console.log('>>> Using VCAP varibale for IoT:', JSON.stringify(config));
} else {
    config = require("./.ibmiotf.json");
    console.log('>>> Using local json for IoT:', JSON.stringify(config));
}

// - Cloudant Service
var cloudantUrl;
if(process.env.CLOUDANT_URL){
  cloudantUrl = process.env.CLOUDANT_URL;
  console.log('>>> Using Environment varibale CLOUDANT_URL = Cloundant URL', JSON.stringify(process.env.CLOUDANT_URL));
}

if(getBluemixVCAP.getServiceCredentialsCloundant().url){
  cloudantUrl = getBluemixVCAP.getServiceCredentialsCloundant().url;
  console.log('>>> Using VCAP = Cloundant URL = ', cloudantUrl);
} else {
  cloudantUrl = require('./.cloudant.json').url;
  console.log('>>> Using JSON = Cloundant URL = ', cloudantUrl);
}

// Setup IoT application on the node.js and run listening IoT service
// For more details using IoT see here: https://github.com/ibm-watson-iot/iot-nodejs#application
var appClientIoT = new ClientIoT.IotfApplication(config);
var deviceType   = "vehicle";
var customIoT    = new CustomIoT(deviceType, appClientIoT, cloudantUrl, cloudant);
customIoT.doIoT();
