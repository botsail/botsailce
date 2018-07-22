#!/bin/bash

apt update
apt install unzip

cd /var/temps
unzip -o Database.zip

sleep 3

mongorestore -u root -pexample -h mongo:27017 /var/temps/Database
