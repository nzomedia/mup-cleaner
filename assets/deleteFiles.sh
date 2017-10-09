#!/bin/bash

APP_NAME=<%= appName %>
filesPath="/opt/$APP_NAME"
mongoDbPath="/opt/mongodb"
mariaDbPath="/opt/mariadb"

if [[ -d $filesPath ]]
then
    read -p "Delete app folder ? " shouldDeleteAppFolder
    if [[ shouldDeleteAppFolder=="yes" ]]
    then
        echo "Deleting app folder ($filesPath)..."
        #rm -rf $filesPath
    fi
else
    echo "Error folder doesn't exist or is not a directory: ($filesPath)."
fi

echo
if [[ -d $mongoDbPath ]]
then
    read -p "Delete MongoDb data ? " shouldDeleteMongoDbData
    if [[ shouldDeleteMongoDbData=="yes" ]]
    then
        echo "Deleting MongoDb data..."
        #rm -rf $mongoDbPath
    fi
else
    echo "MongoDB data path is not a directory or does not exist"
fi
echo

if [[ -d $mariadbPath ]]
then
    read -p "Delete MariaDb data ?" shouldDeleteMariaDBData
    if [[ shouldDeleteMariaDBData=="yes" ]]
    then
        echo "Deleting MariaDb data..."
        #rm -rf $mariaDbPath
    fi
else
    echo "MariaDb data path is not a directory or does not exist"
fi
