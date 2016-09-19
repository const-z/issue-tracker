"use strict";

require("rootpath")();

const Boom = require("boom");
const TokenService = require("services/token");
const UserService = require("services/user");
const config = require("config");

module.exports.css = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/css"
		}
	}
};

module.exports.js = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/js"
		}
	}
};

module.exports.images = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/images"
		}
	}
};

module.exports.libs = {
	auth: false,
	handler: {
		directory: {
			path: "node_modules"
		}
	}
};

module.exports.index = {
	auth: {
		mode: "try"
	},
	handler: function (request, reply) {
		if (!request.auth.isAuthenticated) {
			//return reply.redirect("/signin");
			UserService.signin("guest", "guest", "browser").then(token => {
				reply.view("index").header("authorization", token.token).state(config.tokens.cookieKey ? config.tokens.cookieKey : "token", token.token, config.tokens.cookie).redirect("/");
			}).catch(err => {
				console.error(err);
				reply.view("signin", { error: "Неверное имя пользователя и/или пароль" });
			});
		} else {
			reply.view("index");
		}
	}
};

module.exports.signinForm = {
	auth: {
		mode: "try"
	},
	handler: function (request, reply) {
		if (request.auth.isAuthenticated) {
			return reply.redirect("/");
		}
		reply.view("signin");
	}
};

module.exports.signin = {
	auth: false,
	payload: {
		output: "data",
		parse: true
	},
	handler: function (request, reply) {
		UserService.signin(request.payload.name, request.payload.password, "browser").then(token => {
			reply().header("authorization", token.token).state(config.tokens.cookieKey ? config.tokens.cookieKey : "token", token.token, config.tokens.cookie).redirect("/");
		}).catch(err => {
			console.error(err);
			reply.view("signin", { error: "Неверное имя пользователя и/или пароль" });
		});
	}
};

module.exports.logout = {
	auth: {
		mode: "try"
	},
	handler: function (request, reply) {
		TokenService.invalidateDevice(request.auth.credentials).then(() => {
			reply.redirect("/");
		}).catch(err => {
			const error = err.isBoom ? err : Boom.badRequest(err.message, err);
			return reply(error);
		});
	}
};