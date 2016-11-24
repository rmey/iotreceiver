// More detail to understand see here: https://github.com/ibm-watson-iot/iot-nodejs#application
module.exports = function (theDeviceType, theAppClientIoT, theCloudantUrl, theCloudant) {
  var Bottleneck = require("bottleneck");
  // Never more than 1 request running at a time.
  // Wait at least 250ms between each request.
  // keep the free Cloudant plan happy which has max 10 request/second
  var limiter = new Bottleneck(1, 250);
  var appClientIoT = theAppClientIoT;
  var deviceType   = theDeviceType;
  var cloudantUrl  = theCloudantUrl;
  var cloudant     = theCloudant;

  function savePayload(payload,cb){
    console.error('>>> Starting saving payload in Cloudant');
    cloudant.initConnection(cloudantUrl,function(err,res){
        if(err){
            console.error('>>> Error connecting to db' + err);
            cb(err,null);
        } else {
          cloudant.createDoc(payload,function(err,res){
            if(err){
              console.error(err);
              cb(err,null);
            }
            else{
              console.log('>>> sensor data saved');
              cb(null,'sensor data saved');
            }
            cloudant.closeConnection(function(err,res){
              if(err){
                console.error('>>> error closing cloudant connection: ' + err);
                cb(err,'Error closing Connection');
              }
              else{
                console.log('>>> Connection to cloudant closed');
                cb(null,'Connection closed')
              }
            });
          });
        }
    });
  }

  this.doIoT = function(){
      console.log('>>> Starting Connect IoT');
      appClientIoT.connect();
      // You can use to get more information
      // appClientIoT.log.setLevel('trace');
      console.log('>>> On Connect IoT');
      appClientIoT.on("connect", function () {
              console.log("IoTF Connected");
              appClientIoT.subscribeToDeviceEvents(deviceType);
      });

      console.log('>>> On Connect IoT error');
      appClientIoT.on("error", function () {
              console.error();('Could not connect to IOTF');
              process.exit();
      });

      console.log('>>> On Connect IoT deviceEvent');
      appClientIoT.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
          console.log(">>> Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
          var realPayload = JSON.parse(payload.toString());
          limiter.submit(savePayload, realPayload,function(err,res){
          });
      });
  }
}
