# iotreceiver
* [Overview](#Overview)
* [Run with node.js](#run-with-node.js)
* [Run as local Docker Container](#run-as-local-docker-container)
* [Run as IBM Container scalable group](#run-as-ibm-container-scalable-group)
* [Run as Cloud Foundry App] (#run-as-cloud-foundry-app)

## Overview
The example shows how sensor data from the IBM Bluemix Watson IoT Platform can be stored in a Cloudant NoSQL DB. It connects as application client and waits for messages of a certain sensortype in my case some "BME280" sensors I connected at home via an own gateway with the IoT Platform. You can change the sensor type in server.js. This small service has the task to subscribe to the sensor events and save them in a database as JSON document for later processing (temperature, humidity, ...). The application run as multiple instances for HA, because the IoT Platform supports shared connect options for an application client. To not exceed the limit of my Cloudant instance for write rates I added a rate limiter for the database calls.

## Run with node.js
To run the example locally you need to set Environment Variables or create 2 JSON files ".cloudant.json" and .ibmiotf.json formated like the example files provided.:

`export IOTF='{"org": "YOUR ORG","id": "YOUR APP NAME","auth-key": "YOUR APP KEY","auth-token": "YOUR TOKEN","type" : "shared"}'`<br />
`export CLOUDANT_URL="https://.....-bluemix.cloudant.com"`<br />
`npm install`<br />
`node server.js`<br />

## Run as local Docker Container
With a local Docker engine you need to start the Container with the environment variables described above:

`docker build -t "iotreceiver"`
`docker run -it -e IOTF="$IOTF" -e CLOUDANT_URL="$CLOUDANT_URL"`

## Run as IBM Container scalable group
With the following command the IBM Container Group on IBM Bluemix will be created with auto recovery and anti co-location/anti affinity settings enabled. Please note that the scalable group does not require to expose a public route, but it needs to expose a HTTP port for health checking to enable auto recovery.

`cf ic init`<br /> 
`docker tag iotreceiver registry.YOURREGION.bluemix.net/YOURNAMESPACE/iotreceiver`<br />
`docker push registry.YOURREGION.bluemix.net/YOURNAMESPACE/iotreceiver`<br />
`cf ic group create --name iotreceiver -m 64 -e CLOUDANT_URL="$CLOUDANT_URL" -P -e IOTF="$IOTF" --anti --auto registry.YOURREGION.bluemix.net/YOURNAMESPACE/iotreceiver`<br />

## Run as Cloud Foundry App
To run the example in Bluemix / Cloud Foundry with multiple instances. The Cloudant Service could in that case also provide via the VCAP_SERVICE environment as bound service.

`cf push iotreceiver -m 64M -i 2 --no-start`<br />
`cf set-env iotreceiver IOTF "$IOTF"`<br />
`cf set-env iotreceiver CLOUDANT_URL "$CLOUDANT_URL"`<br />
`cf restage iotreceiver`<br />
