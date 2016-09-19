"use strict";

require("rootpath")();

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const User = require("database/user.js");

const TokenSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: User.constructor.modelName, required: true, index: true },
	deviceId: { type: String, required: true, index: true },
	expiration: { type: Date, required: true },
	valid: { type: Boolean, required: true },
	scope: { type: String, required: true }
}, { versionKey: false, timestamps: { createdAt: "created", updatedAt: "modified" } });

module.exports = Mongoose.model("token", TokenSchema);