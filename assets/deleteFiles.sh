#!/bin/bash

SIMULATION=<%= simulation %>
filesPath=(
      <% for(var item in paths) { %> <%- paths[item] %> <% } %>
)

for i in ${!filesPath[@]}
do
    path=${filesPath[i]}
    if [[ -d $path ]]
    then
        echo "Deleting ($path)..."
        if ! (( SIMULATION ))
        then
            :
            #rm -rf $path
        fi
    else
        echo "Error folder doesn't exist or is not a directory: ($path)."
    fi
done
