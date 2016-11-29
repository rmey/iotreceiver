module.exports = function (){

 this.getServiceCreds = function(name) {
   if (process.env.VCAP_SERVICES) {
      var services = JSON.parse(process.env.VCAP_SERVICES);
      for (var service_name in services) {
         if (service_name.indexOf(name) === 0) {
            var service = services[service_name][0];
            return {
               url: service.credentials.url,
               username: service.credentials.username,
               password: service.credentials.password
            };
         }
      }
   }
   return {};
 }

 this.getServiceCredentialsCloundant = function() {
   var cloudant_service_name = "cloudantNoSQLDB";
   console.log('>>> GetVCAP Credentials for Cloudant :', cloudant_service_name);
   if (process.env.VCAP_SERVICES) {
      var services = JSON.parse(process.env.VCAP_SERVICES);
      for (var service_name in services) {
         if (service_name.indexOf(cloudant_service_name) === 0) {
            var service = services[service_name][0];
            console.log('>>> GetVCAP Credentials for IoT : %s were found', cloudant_service_name);
            return {
               url: service.credentials.url,
               username: service.credentials.username,
               password: service.credentials.password,
               host: service.credentials.host,
               port: service.credentials.port
            };
         }
      }
   }
   return {};
 }

 this.getServiceCredentialsIoT = function() {
   var iot_service = "iotf-service";
   console.log('>>> GetVCAP Credentials for IoT :', iot_service);
   if (process.env.VCAP_SERVICES) {
      var services = JSON.parse(process.env.VCAP_SERVICES);
      for (var service_name in services) {
         if (service_name.indexOf(iot_service) === 0) {
            var service = services[service_name][0];
            console.log('>>> GetVCAP Credentials for IoT : %s were found', iot_service);
            return {
               iotCredentialsIdentifier: service.credentials.iotCredentialsIdentifier,
               mqtt_host: service.credentials.mqtt_host,
               mqtt_u_port: service.credentials.mqtt_u_port,
               mqtt_s_port: service.credentials.mqtt_s_port,
               http_host: service.credentials.http_host,
               org: service.credentials.org,
               apiKey: service.credentials.apiKey,
               apiToken: service.credentials.apiToken
            };
         }
      }
   }
   return {};
 }

}
