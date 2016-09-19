"use strict";

const Hapi = require("hapi");
const Inert = require("inert");
const Vision = require("vision");
const HapiJWT = require("hapi-auth-jwt2");
const dateformat = require("dateformat");

const routes = require("./routes");
const config = require("./config");
const server = new Hapi.Server(config.server.options);
const TokenService = require("./services/token.js");

server.connection(config.server.api);

server.register([Inert, Vision, HapiJWT], (err) => {

	if (err) {
        throw err;
    }

	server.auth.strategy("jwt", "jwt", true, {
		key: config.tokens.secret,
		validateFunc: TokenService.validate,
		cookieKey: config.tokens.cookieKey,
		verifyOptions: {
			algorithms: ["HS256"]
		}
	});

	server.register(routes, (err) => {

		if (err) {
			throw err;
		}

		server.start((err) => {
			if (err) {
				throw err;
			}
			console.log("Server running at:" + server.info.uri);
		});

	});
});

server.on("response", function (request) {
	let date = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss.l");
	let from = request.info.remoteAddress + ": " + request.method.toUpperCase() + " " + request.url.path + " --> " + request.response.statusCode;
	if (request.response._error) {
		console.error("%s : %s\n%s", date, from, request.response._error.message);
	} else {
		console.log(date, " : ", from);
	}
});