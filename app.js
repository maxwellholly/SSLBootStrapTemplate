"use strict"

var fs = require("fs");
var http = require("http");
var path = require("path");
var url = require("url");

var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

let ejs = require("ejs");
const router = express.Router();
var app = express();
app.set("view engine","ejs");
app.engine("ejs",require("ejs").__express);

const session = require("express-session");
app.use(session({secret:"secret",saveUninitialized:true,resave:true}))
var sess;

router.get("/",function(req,res){
    sess = req.session;
    res.render("index",{pagename:"Home",sess:sess});
})

router.get("/about",function(req,res){
    sess = req.session;
    res.render("about",{pagename:"About",sess:sess});
})

router.get("/login",function(req,res){
    sess = req.session;
    res.render("login",{pagename:"Login",sess:sess});
})

router.get("/register",function(req,res){
    sess = req.session;
    res.render("register",{pagename:"Register",sess:sess});
})

router.get("/contact",function(req,res){
    sess = req.session;
    res.render("contact",{pagename:"Contact",sess:sess});
})

router.get("/profile",function(req,res){
    sess = req.session;
    if(typeof(sess)==="undefined" || sess.loggedin !== true){
        var errors = ["Not an authenticated user"]
        res.render("login",{pagename:"Login",errors:errors})
    }else{
        res.render("profile",{pagename:"Profile",sess:sess})
    }
})

router.get("/logout",function(req,res){
    sess = req.session;
    sess.destroy(function(err){
        res.redirect("/");
    })
})

router.post("/login",function(req,res){
    var errors = [];
    if(req.body.email.toLowerCase() !== "mike@aol.com" || req.body.password !== "abc123" || req.body.email === "" || !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email) || req.body.password === "") {
        errors.push('Invalid login attempt, please try again.')
        res.render("login",{pagename:"Login", errors:errors});
    } else {
        sess = req.session;
        sess.loggedin = true;
        res.render("profile",{pagename:"Profile",sess:sess})
    }
})

router.post("/register",function(req,res){
    var errors = [];
    var success = [];
    if(req.body.firstName === "" || !/^[a-z ,.'-]+$/i.test(req.body.firstName)) {
        errors.push('A valid first name is required.')
    } else {
        success.push('A valid first name was entered.')
    }
    if(req.body.lastName === "" || !/^[a-z ,.'-]+$/i.test(req.body.lastName)) {
        errors.push('A valid last name is required.')
    } else {
        success.push('A valid last name was entered.')
    }
    if(req.body.address === "" || !/[A-Za-z0-9'\.\-\s\,]/.test(req.body.address)) {
        errors.push('A valid address is required.')
    } else {
        success.push('A valid address was entered.')
    }
    if(req.body.city === "" || !/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(req.body.city)) {
        errors.push("A valid city is required.")
    } else {
        success.push('A valid city was entered.')
    }
    if(req.body.state === "" || !/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(req.body.state)) {
        errors.push("A valid state is required.")
    } else {
        success.push('A valid state was entered.')
    }
    if(req.body.zip === "" || !/^\d{5}$/.test(req.body.zip)) {
        errors.push("A valid zip code is required.")
    } else {
        success.push('A valid zip was entered.')
    }
    if(req.body.age === "") {
        errors.push("A valid age is required.")
    } else {
        success.push('A valid age was entered.')
    }
    if(req.body.gender === undefined) {
        errors.push("Gender is required.")
    } else {
        success.push('A valid gender was entered.')
    }
    if(req.body.consent === undefined) {
        errors.push("Consent is required.")
    } else {
        success.push('Consent was selected.')
    }
    if(req.body.bio === "") {
        errors.push("A bio is required.")
    } else {
        success.push('A bio was entered.')
    }
    res.render("register",{pagename:"Register", errors:errors, success:success});
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use("/",router);
var server = app.listen("8080");