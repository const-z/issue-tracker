"use strict";

require("rootpath")();

const fetch = require("node-fetch");
const config = require("config");

class IssuesService {

	constructor() {
		this._issues_url = "https://api.bitbucket.org/2.0/repositories/" + config.repository.username + "/" + config.repository.repoSlug + "/issues";
		this._comments_issue_url = this._issues_url + "/#id#/comments";
		this._comment_issue_url = this._comments_issue_url + "/#commentId#";
		this._fetch_options = { headers: { "authorization": config.repository.auth.basic } };
	}

	getIssues() {
		return fetch(this._issues_url, {
			headers: {
				"authorization": config.repository.auth.basic
			}
		}).then(body => {
			return body.json();
		}).then(issues => {
			let p = [];
			for (let i of issues.values) {
				p.push(this.getIssueLastComment(i.id).then(comments => {
					i.comments = comments;
					return i;
				}));
			}
			return Promise.all(p);
		}).then(issues => {
			return issues;
		});
	}

	getIssueLastComment(issueId) {
		let comments_url = this._comments_issue_url.replace("#id#", issueId);
		return fetch(comments_url, this._fetch_options).then(body => {
			return body.json();
		}).then(links => {
			if (!links.values.length) {
				return;
			}

			let p = [];
			for (let c of links.values) {
				let comment_url = comments_url + "/" + c.id;
				p.push(fetch(comment_url, this._fetch_options).then(result => {
					return result.json();
				}));
			}
			return Promise.all(p);
		});
	}

}

module.exports = new IssuesService();