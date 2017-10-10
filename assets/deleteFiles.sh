#!/bin/bash

filesPath=(
      <% for(var item in paths) { %> <%- paths[item] %> <% } %>
)

for i in ${!filesPath[@]}
do
    path=${filesPath[i]}
    if [[ -d $path ]]
    then
        echo "Deleting ($path)..."
        #rm -rf $path
    else
        echo "Error folder doesn't exist or is not a directory: ($path)."
    fi
done
