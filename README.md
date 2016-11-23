# iotreceiver
* [Overview](#Overview)
* [Run with node.js](#run-with-node.js)
* [Run as local Docker Container](#run-as-local-docker-container)
* [Run as IBM Container scalable group](#run-as-ibm-container-scalable-group)

## Overview
The example shows how sensor data from the IBM Bluemix Watson IoT Platform can be stored in a Cloudant NoSQL DB. It connects as application client and waits for messages of a certain sensortype in my case some "BME280" sensors I connected at home via an own gateway with the IoT Platform. This small service has the task to subscribe to the sensor events and save them in a database as JSON document for later processing (temperature, humidity, ...). The application run as multiple instances for HA, because the IoT Platform supports shared connect options for an application client. In my case I will run a scalable Container Group in IBM Container Service with multiple instances. To not exceed the limit of my Cloudant instance for write rates I added a rate limiter to the database calls.

## Run with node.js
To run the example locally you need to set Environment Variables or create 2 JSON files ".cloudant.json" and .ibmiotf.json formated like the example files provided.:<br />`export IOTF='{"org": "YOUR ORG","id": "YOUR APP NAME","auth-key": "YOUR APP KEY","auth-token": "YOUR TOKEN","type" : "shared"}'`<br />`export CLOUDANT_URL="https://.....-bluemix.cloudant.com"`<br /> `npm install` <br />`node server.js`

## Run as local Docker Container
With a local Docker engine you need to start the Container with the environment variables described above:<br />`docker build -t "iotreceiver"`<br >`docker run -it -e IOTF="$IOTF" -e CLOUDANT_URL="$CLOUDANT_URL"`<br /> 

## Run as IBM Container scalable group
With the following command the IBM Container Group on IBM Bluemix will be created with auto recovery and anti co-location/anti affinity settings enabled. Please note that the scalable group does not require to expose a public route, but it needs to expose a HTTP port for health checking to enable auto recovery<br /> `cf ic group create --name iotreceiver -m 64 -e CLOUDANT_URL="$CLOUDANT_URL" -P -e IOTF="$IOTF" --anti --auto registry.eu-gb.bluemix.net/yournamespace/iotreceiver`<br /> <br /> Or as Cloud Foundry multi instance App </br> `cf push iotreceiver -m 64M -i 2 --no-start`<br />`cf set-env iotreceiver IOTF "$IOTF"`<br />`cf set-env iotreceiver CLOUDANT_URL "$CLOUDANT_URL"`<br />`cf restage iotreceiver`<br />
