"use strict";

require("rootpath")();

const Boom = require("boom");
const Joi = require("joi");
const config = require("config");
const UserService = require("services/user");
const TokenService = require("services/token");

module.exports.login = {
	description: "Вход в систему - получить токен доступа",
	auth: false,
	validate: {
		payload: Joi.object({
			login: Joi.string(),
			password: Joi.string(),
			deviceId: Joi.string()
		}).unknown(false)
	},
	plugins: {
		"hapi-swagger": {
			responses: {
				"400": {
					description: "Bad Request"
				},
				"401": {
					description: "Unauthorized"
				},
				"200": {
					description: "Success"
				}
			}
		}
	},
	handler: function (request, reply) {
		UserService.login(request.payload.login, request.payload.password, request.payload.deviceId).then(token => {
			reply(token).header("authorization", token.token).state("token", token.token, config.tokens.cookie);
		}).catch(err => {
			const error = err.isBoom ? err : Boom.badRequest(err.message, err);
			return reply(error);
		});
	}
};

module.exports.logout = {
	description: "Выход из системы - сброс токена доступа",
	validate: {
		headers: Joi.object({
			"authorization": Joi.string()
		}).unknown()
	},
	plugins: {
		"hapi-swagger": {
			responses: {
				"400": {
					description: "Bad Request"
				},
				"401": {
					description: "Unauthorized"
				},
				"200": {
					description: "Success"
				}
			}
		}
	},
	handler: function (request, reply) {
		TokenService.invalidateDevice(request.auth.credentials).then(() => {
			reply();
		}).catch(err => {
			const error = err.isBoom ? err : Boom.badRequest(err.message, err);
			return reply(error);
		});
	}
};