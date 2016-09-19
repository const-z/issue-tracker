"use strict";

let config = null;

try {
	config = require("./config-custom.js");
	console.log("use config-custom.js");
} catch (err) {
	console.log("use config.js");
}

if (!config) {
	config = {
		database: {
			mongo: {
				url: "mongodb://localhost/issue-tracker?keepAlive=120",
				debug: true
			}
		},
		repository: {
			username: "",
			repoSlug: "",
			auth:{
				basic: ""
			}
		},
		tokens: {
			secret: "secret_key_string",
			ignoreExpiration: true,
			expiration: 24 * 60 * 60 * 1000,
			cookie: {
				ttl: 24 * 60 * 60 * 1000,
				encoding: "none",
				isSecure: false,
				isHttpOnly: false,
				clearInvalid: true,
				strictHeader: true,
				path: "/"
			}
		},
		server: {
			api: {
				host: "0.0.0.0",
				port: 3000,
				labels: "api",
				routes: {
					cors: true
				}
			}
		},
		routes: {
			prefix: "/api"
		},
		swagger: {
			info: {
				"title": "Менеджер задач",
				"description": "-----"
			},
			host: "localhost:3000",
			lang: "ru",
			connectionLabel: "api",
			basePath: "/api",
			pathPrefixSize: 2,
			sortEndpoints: "ordered",
			sortTags: "name"
		}
	};
}

module.exports = config;