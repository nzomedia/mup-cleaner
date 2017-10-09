#!/bin/bash

METEOR_BASE_IMAGE=<%= meteorBaseImage %>

#Gather all docker images identified by <repositoryName>/<tag>
echo Docker images found:
printf "%-40s | %-.30s\n" "Repository/tag" "Short image ID"
docker image list | tail -n +2 | while read repo tag imageId rest
do
  repoAndTag="$repo:$tag"
   printf "%-40s | %-.30s...\n" $repoAndTag $imageId
done
echo

# Verify that each given ID is at least 4 caracters long.
function verifyImageIds
{
    for id in $@
    do
        if [[ ((${#id} < 4)) ]]
        then
            return 1
        fi
    done
    return 0
}

read -p "Enter (at least) the first 4 ID caracters of images to delete (ie: 1e12 c21e 3a31 ...): " imageIds 

#Verify that every entered ID is at least 4 caracters long:
if ! verifyImageIds $imageIds
then
    echo "There is at least one incomplete image ID."
    echo "Cancelling docker image deletion"
    exit 0
else
    for id in $imageIds
        do
        read -p "Delete image $id ? " shouldDeleteImage
        if [ $shouldDeleteImage == "yes" ]
        then
            echo "Deleting image $id:"
            #shall we exit on error ? 
            #docker rmi $image
        else
            echo "Leaving image $id."
        fi
    done
fi

# résoudre le probleme de blocage de read
# travailler sur la sauvegarde et la restauration des données.