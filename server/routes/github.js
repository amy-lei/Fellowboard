const express = require("express");
const fetch = require('node-fetch');
const mongoose = require("mongoose");
const Post = require("../models/Post");

const mongoConnectionURL = process.env.MONGODB_SRV; 

const connectToDB = async () => {
    mongoose
    .connect(mongoConnectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: "Dashboard",
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(`${err}: Failed to connect to MongoDB`));
}


const issues = "issues";
const pullRequests = "pulls";

/*
org and repo are hard-coded here, will need input from frontend to pass in params
*/
var org = "MLH-Fellowship";
var repo = "httpie";

async function fetchIssues(org, repo) {
    await connectToDB();
    try {
        fetch(`https://api.github.com/repos/${org}/${repo}/${issues}`)
        .then(response => response.json())
        .then(data => {
            var issues = [];
            for(var i=0; i<data.length; i++) {
                var allAssignees = [];

                var dict = data[i].assignees;
                dict.forEach(function(d){
                    allAssignees.push(d.login);
                });
                var issue = {
                    'creator': 'server',
                    'tags': [repo, org],
                    'title': data[i].title,
                    'type': 'Github',
                    'timestamp': new Date(data[i].created_at),
                    'isPublic': true,
                    'content': {
                        'url': data[i].url,
                        'body': data[i].body,
                        'state': data[i].state,
                        'creator': data[i].user.login,
                        'allAssignees': allAssignees
                    }
                };
                issues.push(issue);
                addPostToDatabase(issue);

            }
            console.log(issues);
            return issues;
        });
    } catch(err) {
        console.log(err);
    }
}

async function fetchPRs(org, repo) {
    await connectToDB();
    try {
        fetch(`https://api.github.com/repos/${org}/${repo}/${pullRequests}`)
        .then(response => response.json())
        .then(data => {
            var PRs = [];
            for(var i=0; i<data.length; i++) {
                var allAssignees = [];

                var dict = data[i].assignees;
                dict.forEach(function(d){
                    allAssignees.push(d.login);
                });

                var PR = {
                    'creator': 'server',
                    'tags': [repo, org],
                    'title': data[i].title,
                    'type': "Github",
                    'timestamp': new Date(data[i].created_at),
                    'isPublic': true,
                    'content': {
                        'url': data[i].url,
                        'body': data[i].body,
                        'state': data[i].state,
                        'creator': data[i].user.login,
                        'allAssignees': allAssignees
                    }
                };
                PRs.push(PR);
                addPostToDatabase(PR);
            }
            console.log(PRs);
            return PRs;
        });
    } catch(err) {
        console.log(err);
    }
}

async function addPostToDatabase(post) {
    var toInsert = Post(post);
    try {
        const exists = await Post.findOne(post);
        if(!exists) {
            await toInsert.save();
            console.log(`added ${post.title} to database.`);
        }
        else {
            console.log(`${post.title} already exists.`);
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = {fetchIssues, fetchPRs};