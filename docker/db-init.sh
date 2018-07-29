#!/bin/bash

apt update
apt install unzip

cd /var/temps
unzip -o Database.zip

sleep 3

mongorestore --host mongo --port 27017 /var/temps/Database
