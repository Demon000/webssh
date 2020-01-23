module.exports = {
	port: 5001,
	secret: "ilikecats",
	servers: {
                "ods-build": {
                        host: "localhost",
                        port: 22
                },
                "ods-prod": {
                        host: "172.17.0.11",
                        port: 22
                }
	}
};
