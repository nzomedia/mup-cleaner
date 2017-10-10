#!/bin/bash

SIMULATION=<%= simulation %>

echo "Removing Docker..."
if ! (( SIMULATION ))
then
    :
    #apt-get remove docker
fi