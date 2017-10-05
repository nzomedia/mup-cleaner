
module.exports = {

    uninstall: {
        description: "Uninstall app and clean everything",
        handler: function(api) {
            try {
                const meteorSession = api.getSessions(["meteor"]);
                const mongoSession = api.getSessions(["mongo"]);

                //stop each service:
                api.runCommand("meteor.stop").then(function(){
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

                
                //delete Docker images

                //delete scripts

                //remove Docker ?
                //console.log("Fini");
            }
            catch(error) {
                console.log("Mup error:", error);
            }

        }
    }
}
