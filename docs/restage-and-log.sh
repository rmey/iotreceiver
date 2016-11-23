#!/bin/bash
# Information steps:
# 1) chmod u+x restage-and-log.sh
# 2) ./restage-and-log.sh
# cf api https://api.eu-gb.bluemix.net UK
# cf api https://api.ng.bluemix.net US

echo "--> Ensure to deploy into the right Project Region"
cd ..
cf api https://api.eu-gb.bluemix.net
cf login

echo "--> Starting push and log CF demo-visual-recognition-backend"

echo "****** show existing apps *********"
cf apps
echo "******* push to CF ********"
cf restage  iotreceiver
echo "******* start CF logging ********"
cf logs  iotreceiver
