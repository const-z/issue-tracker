"use strict";

require("rootpath")();

const fetch = require("node-fetch");
const config = require("config");

class IssuesService {

	constructor(){
		this._issues_url = "https://api.bitbucket.org/2.0/repositories/" + config.repository.username + "/" + config.repository.repoSlug + "/issues";
		this._comments_issue_url = this._issues_url+"/#id#/comments";
		this._comment_issue_url = this._comments_issue_url+"/#commentId#";
	}

	getIssues() {
		return fetch(this._issues_url, {
			headers: {
				"authorization": config.repository.auth.basic
			}
		}).then(body => {
			return body.json();
		}).then(issues=>{
			let p = [];
			for (let i of issues.values) {
				p.push(this.getIssueLastComment(i.id).then(comment=>{
					i.lastComment = comment;
					return i;
				}));
			}
			return Promise.all(p);
		}).then(issues=>{
			return issues;
		});
	}

	getIssueLastComment(issueId){
		let comments_url = this._comments_issue_url.replace("#id#", issueId);
		return fetch(comments_url, {
			headers: {
				"authorization": config.repository.auth.basic
			}
		}).then(body => {
			return body.json();
		}).then(links=>{
			if (!links.values.length) {
				return;
			}
			let comment_url = comments_url+"/"+links.values[links.values.length-1].id;
			return fetch(comment_url, {headers:{"authorization": config.repository.auth.basic}});
		}).then(body=>{
			if (!body) {
				return;
			}
			return body.json();
		}).then(comment=>{
			if (!comment) {
				return;
			}
			return {
				created: comment.created_on,
				content: comment.content.html
			};
		});
	}

}

module.exports = new IssuesService();