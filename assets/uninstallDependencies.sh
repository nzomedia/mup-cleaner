#!/bin/bash

SIMULATION=<%= simulation %>

echo "Removing Docker..."
if ! (( SIMULATION ))
then
    sudo apt-get remove docker
fi