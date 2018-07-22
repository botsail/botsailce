#!/bin/bash

bash /usr/local/bin/docker-entrypoint.sh

sleep 3

cd /var/botsailce

npm install
npm start
