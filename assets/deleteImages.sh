#!/bin/bash

METEOR_BASE_IMAGE=<%= meteorBaseImage %>
APP_NAME=<%= appName %>
APP_DOCKER_IMAGE_REPO=mup-$APP_NAME
SIMULATION=<%= simulation %>

#We build an array containing all Docker images:
PLUGIN_IMAGES=(${APP_DOCKER_IMAGE_REPO,,}:{"build","latest","previus"} <%= pluginImages %>)

#List of docker images:
# echo List of docker images to delete:
# for i in ${!PLUGIN_IMAGES[@]}
# do
#     printf "%-40s\n" ${PLUGIN_IMAGES[$i]}
# done
# echo

for i in ${!PLUGIN_IMAGES[@]}
do
    echo "Deleting image ${PLUGIN_IMAGES[$i]}:"
    #shall we exit on error ?
    if ! (( SIMULATION ))
    then
        :
        #docker rmi ${PLUGIN_IMAGES[$i]}
    fi
done

# résoudre le probleme de blocage de read
# travailler sur la sauvegarde et la restauration des données.