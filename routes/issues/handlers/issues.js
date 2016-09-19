"use strict";

require("rootpath")();

const Boom = require("boom");
const Joi = require("joi");
// const config = require("config");
const IssuesService = require("services/issues");

module.exports.get = {
	auth: {
		scope: ["user", "guest"]
	},
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
		IssuesService.getIssues().then(issues => {
			reply(issues);
		}).catch(err => {
			const error = err.isBoom ? err : Boom.badRequest(err.message, err);
			return reply(error);
		});
	}
};