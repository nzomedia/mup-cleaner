
const nodemiral = require("nodemiral");

/**
 * Stop each deployed service:
 * @param api {Object} mup api object to access configuration and other usefull functions.
 */
function stopServices(api){
	return api.runCommand("meteor.stop").then(function(){
			console.log("Meteor app and container stoped");
			return api.runCommand("mongo.stop");
			}).then(function(){
				console.log("MongoDb server and container stoped");
				return api.runCommand("mariadb.stop");
			}).then(function(){
				console.log("MariaDb server and container stoped");
			}).catch(function(error){
				console.log("Erreur:", error);
			});
}

module.exports = {

    /**
     * Uninstall meteor app, its dependencies and try to clean plugin created
     * files.
     */
    uninstall: {
        description: "Uninstall app and clean everything",
        handler: function(api) {
            try {
                //We suppose that external servers may be used
                //for other purposes so with that in mind and for the sake 
                //of simplicity we'll only deal with the server hosting
                //the meteor app.
                const meteorSession = api.getSessions(["meteor"]);
                const config = api.getConfig();

                stopServices(api)
                .then(function(){

                    const meteorBaseImage = config.app.docker.image;
                    if(!meteorBaseImage){
                        console.log("Error: Meteor base docker image name is empty.");
                    }

                    const list = nodemiral.taskList("Delete container images");

                    //delete Docker images
                    list.executeScript("Delete images", {
                        script: api.resolvePath(__dirname, 'assets/deleteImages.sh'),
                        vars: {
                            meteorBaseImage: meteorBaseImage,
                        }
                    });

                    //delete app files (app files, setup script, database data)
                    list.executeScript("Delete files", {
                        script: api.resolvePath(__dirname, 'assets/deleteFiles.sh'),
                        vars: {
                            appName: api.getConfig().app.name
                        }
                    });

                    //uninstall docker
                    list.executeScript("Uninstall dependencies", {
                        script: api.resolvePath(__dirname, 'assets/uninstallDependencies'),
                        vars: {}
                    });

                    return api.runTaskList(list, meteorSession, {verbose: api.verbose});
                    
                })
                .then(function(){
                    console.log("mup-cleaner finished succesfully.");
                })
                .catch(function(error){
                    console.log("mup-cleaner error:", error);
                });
            }
            catch(error) {
                console.log("Mup error:", error);
            }
        }
    }
}
