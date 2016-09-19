"use strict";

require("rootpath")();

const path = require("path");
const util = require("util");
const ejs = require("ejs");
const routes = require("./routes.js");

module.exports.register = function (server, options, next) {

	server.views({
        engines: {
			html: { module: ejs }
		},
		path: path.join(__dirname, "../../public/build"),
		isCached: false
    });

	for (let route of routes) {
		if (route.config.auth && util.isObject(route.config.auth) && !route.config.auth.scope) {
			route.config.auth.scope = ["user", "guest"];
		}
		server.route(route);
	}
	next();
};

module.exports.register.attributes = {
    name: "web",
    version: "1.0.0"
};

module.exports.select = ["api"];