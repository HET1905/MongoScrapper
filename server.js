var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

var PORT = 3000;

var app = express();


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Use morgan logger for logging requests
// app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrapper";

// mongoose.connect(MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true },function(err){
    if(err){
        console.log(err)
    }else{
        console.log('Mongo db connected');
    }
});


// Import routes and give the server access to them.
var routes = require("./api-routes/routes.js");

app.use(routes);


// Routes

// A GET route for scraping the echoJS website

app.listen(PORT, function() {
    console.log("App now listening at http://localhost:" + PORT);
  });
  