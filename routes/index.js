"use strict";

require("rootpath")();

const config = require("config");


let routes = [];
routes.push(require("./security"));
routes.push(require("./issues"));
routes.push(require("./web"));

for (let r of routes) {
	r.prefix = config.routes.prefix;
}

module.exports = routes;