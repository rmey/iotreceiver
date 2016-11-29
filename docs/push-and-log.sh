#!/bin/bash
# Information steps:
# 1) chmod u+x push-and-log.sh
# 2) ./push-and-log.sh
# cf api https://api.eu-gb.bluemix.net UK
# cf api https://api.ng.bluemix.net US

echo "--> Ensure to deploy into the right bluemix region"
cd ..
cf api https://api.eu-gb.bluemix.net
cf login

echo "--> Starting push and log CF iotreceiver"

echo "****** show existing apps *********"
cf apps
echo "******* push to CF ********"
cf push  iotreceiver-tsuedbro
echo "******* start CF logging ********"
cf logs  iotreceiver-tsuedbro
