"use strict";

require("rootpath")();

const Boom = require("boom");
const TokenService = require("services/token");
const UserModel = require("database").User;

class UserService {

	constructor() {

	}

	signin(login, password, deviceId) {
		if (!login && !password) {
			login = "guest";
			password = "guest";
		}
		login = login.toLowerCase();
		return UserModel.findOne({login: login, password: password}).then(user => {
			if (!user) {
				throw Boom.unauthorized();
			}
			let _token = {
				deviceId: deviceId,
				userId: user._id,
				scope: user.scope
			};
			return TokenService.create(_token);
		});
	}

}

module.exports = new UserService();