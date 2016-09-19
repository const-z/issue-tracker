"use strict";

require("rootpath")();

const Handlers = require("./handlers");

module.exports = [

	{ method: "GET", path: "/", config: Handlers.web.index },
	{ method: "GET", path: "/signin", config: Handlers.web.signinForm },
	{ method: "POST", path: "/signin", config: Handlers.web.signin },
	{ method: "GET", path: "/logout", config: Handlers.web.logout },
	{ method: "GET", path: "/libs/{params*}", config: Handlers.web.libs },
	{ method: "GET", path: "/css/{params*}", config: Handlers.web.css },
	{ method: "GET", path: "/js/{params*}", config: Handlers.web.js },
	{ method: "GET", path: "/images/{params*}", config: Handlers.web.images }

];

