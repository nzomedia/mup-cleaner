
const nodemiral = require("nodemiral");

/**
 * Stop each deployed service:
 * @param api {Object} mup api object to access configuration and other usefull functions.
 */
function stopServices(api){
    if( api.getArgs().indexOf("--deleteEverything") == -1 ){
        console.log("Execute meteor.stop");
        console.log("Execute mongo.stop");
        console.log("Execute mariadb.stop");
        return Promise.resolve();
    }
    function manageError(error){
        console.log("Error:", error.nodemiralHistory);
        return Promise.resolve();
    }
	return api.runCommand("meteor.stop").then(function(){
			console.log("Meteor app and container stoped");
			return api.runCommand("mongo.stop");
            }, manageError)
            .then(function(){
				console.log("MongoDb server and container stoped");
				return api.runCommand("mariadb.stop");
            }, manageError)
            .then(function(){
				console.log("MariaDb server and container stoped");
            }, manageError);
}

module.exports = {

    /**
     * Uninstall meteor app, its dependencies and try to clean plugin created
     * files.
     */
    uninstall: {
        description: "Uninstall app and clean everything.\
        Without \"--deleteEveryting\" flag it only does a simulation.",
        builder: function(yargs){
            return yargs.options(
                {
                    "deleteEverything": {
                        description: "Stops the meteor app, deletes containers,\
                         docker images and all app and DB files.",
                        type: "boolean",
                        default: false
                    }
                })
        },
        handler: function(api) {
            try {
                //We suppose that external servers may be used
                //for other purposes so with that in mind and for the sake 
                //of simplicity we'll only deal with the server hosting
                //the meteor app.
                const config = api.getConfig();
                const meteorSession = nodemiral.session(
                    config.servers.one.host, 
                    {
                        username: config.servers.one.username,
                        password: config.servers.one.password
                    },
                    {
                        ssh: {
                            port: config.servers.one.opts.port
                        }
                    }
                );
                const simulate = (api.getArgs().indexOf("--deleteEverything") > -1)?0:1;
                if(simulate)
                    console.log("------ Simulation (nothing is really performed): --------");
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
                            appName: api.getConfig().app.name,
                            meteorBaseImage: meteorBaseImage,
                            pluginImages: "mariadb mongo:" + config.mongo.version + " " + config.app.docker.image,
                            simulation: simulate
                        }
                    });

                    //delete app files (app files, setup script, database data)
                    list.executeScript("Delete files", {
                        script: api.resolvePath(__dirname, 'assets/deleteFiles.sh'),
                        vars: {
                            appName: api.getConfig().app.name,
                            paths: ["/opt/"+config.app.name, "/opt/mongodb", "/opt/mariadb"],
                            simulation: simulate
                        }
                    });

                    //uninstall docker
                    list.executeScript("Uninstall dependencies", {
                        script: api.resolvePath(__dirname, 'assets/uninstallDependencies.sh'),
                        vars: {
                            simulation: simulate
                        }
                    });

                    return api.runTaskList(list, meteorSession, {verbose: api.verbose});
                })
                .then(function(){
                    if(simulate)
                        console.log("mup-cleaner simulation finished succesfully.");
                    else    
                        console.log("mup-cleaner finished succesfully.");
                })
            }
            catch(error) {
                console.log("mup-cleaner handler error:", error);
            }
        }
    }
}
