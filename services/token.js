"use strict";

require("rootpath")();

const TokenModel = require("database").Token;
const config = require("config");
const JWT = require("jsonwebtoken");

class TokenService {

	constructor() {

	}

	create(payload) {
		payload.expiration = new Date().getTime() + config.tokens.expiration;
		let _token = { userId: payload.userId, deviceId: payload.deviceId, expiration: payload.expiration };
		return this._signTokenData(_token).then(token => {
			_token = token;
			return TokenModel.update({ deviceId: payload.deviceId, userId: payload.userId, valid: true }, { $set: { valid: false } }, { multi: true });
		}).then(() => {
			payload.valid = true;
			return new TokenModel(payload).save();
		}).then(() => {
			return { token: _token };
		});
	}

	modifyData(token, data) {
		return TokenModel.update({ deviceId: token.deviceId, userId: token.userId, valid: true }, data, {}).then(() => {
			return;
		});
	}

	_signTokenData(data) {
		return new Promise((resolve, reject) => {
			try {
				let token = JWT.sign(data, config.tokens.secret);
				resolve(token);
			} catch (err) {
				reject(err);
			}
		});
	}

	validate(token, request, callback) {
		TokenModel.findOne({ userId: token.userId, deviceId: token.deviceId, expiration: token.expiration, valid: true }).then(doc => {
			callback(null, !!doc, doc ? doc.toJSON() : undefined);
		}).catch(err => {
			callback(err, false);
		});
	}

	invalidateAll(token) {
		return TokenModel.update({ userId: token.userId, valid: true }, { $set: { valid: false } }, { multi: true });
	}

	invalidateDevice(token) {
		return TokenModel.update({ userId: token.userId, deviceId: token.deviceId, valid: true }, { $set: { valid: false } }, { multi: true });
	}

}

module.exports = new TokenService();