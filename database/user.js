"use strict";

require("rootpath")();

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
	login: { type: String, index: true, unique: true },
	password: { type: String, select: false },
	scope: { type: String, enum: ["guest", "user", "admin"], required: true}
}, { versionKey: false, timestamps: { createdAt: "created", updatedAt: "modified" } });

module.exports = Mongoose.model("user", UserSchema);