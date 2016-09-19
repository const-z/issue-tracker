"use strict";

require("rootpath")();

const routes = require("./routes.js");
const config = require("config");

module.exports.register = function (server, options, next) {

	let i = 1;
	for (let route of routes) {
		if (!route.config.plugins) {
			route.config.plugins = { "hapi-swagger": {} };
		}
		route.config.plugins["hapi-swagger"].order = i++;
		route.path = config.routes.prefix + "/security" + route.path;
		route.config.tags = ["api"];
		server.route(route);
	}
	next();
};

module.exports.register.attributes = {
    name: "security",
    version: "1.0.0"
};

module.exports.select = ["api"];