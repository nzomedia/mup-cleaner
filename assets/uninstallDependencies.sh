#!/bin/bash

read -p "Uninstall Docker ? " shouldRemoveDocker
if [[ shouldRemoveDocker=="yes" ]]
then
    echo "Removing Docker..."
    #apt-get remove docker
fi