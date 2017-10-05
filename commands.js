
module.exports = {

    uninstall: {
        description: "Uninstall app and clean everything",
        async handler(api) {
            try {
                const meteorSession = api.getSessions(["meteor"]);
                const mongoSession = api.getSessions(["mongo"]);

                //stop each service:
                await api.runCommand("meteor.stop");
                console.log("Meteor app and container stoped");
                await api.runCommand("mongo.stop");
                console.log("MongoDb server and container stoped");
                await api.runCommand("mariadb.stop");
                console.log("MariaDb server and container stoped");
                
                //delete Docker images

                //delete scripts

                //remove Docker ?
                console.log("Fini");
            }
            catch(error) {
                console.log("Mup error:", error);
            }

        }
    }
}
