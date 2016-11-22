# iotreceiver
Documentation is work in progress

The example shows how sensor data from the IBM Bluemix Watson IOT Platform can be stored in a Cloudant NoSQL DB. It connects as application client and waits for messages of a certain sensortype in my case some "BME280" sensors I connected at home via an own gateway with the IOT Platform. This small service has the task to subscribe to the sensor events and save them in a database as JSON document for later processing (temperature, humidity, ...). The application could be run as multiple instances for HA, because the IOT Platform supports shared connect options for an application client. In my case I will run a scalable Container Group in IBM Container Service with multiple instances. To not exceed the limit of my Cloudant instance for write rates I added a rate limiter to my calls to the database. To run the example locally you need to set Environment Variables or create 2 JSON files ".cloudant.json" and .ibmiotf.json formated like the example files provided.:<br />`export IOTF='{"org": "YOUR ORG","id": "YOUR APP NAME","auth-key": "YOUR APP KEY","auth-token": "YOUR TOKEN","type" : "shared"}'`<br />`export CLOUDANT_URL="https://.....-bluemix.cloudant.com"`<br /> `npm install` <br />`node server.js`<br />Or with Docker:<br />`docker build -t "iotreceiver"`<br >`docker run -it -e IOTF="$IOTF" -e CLOUDANT_URL="$CLOUDANT_URL"`<br /> Or as scalabe IBM Container Group with auto recovery and anti co-location/anti affinity settings<br /> `cf ic group create --name iotreceiver -m 64 -e CLOUDANT_URL="CLOUDANT_URL" -P -e IOTF="$IOTF" --anti --auto registry.eu-gb.bluemix.net/yournamespace/iotreceiver`<br /> Note the scalable Group has no public connectivity since I did not assign a route or public IP, allthough the -P or -p option is needed to enable autorecovery.
