var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

var app = express();


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Use morgan logger for logging requests
// app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrapper";

// mongoose.connect(MONGODB_URI);
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Mongo db connected');
    }
});


// Import routes and give the server access to them.
var routes = require("./api-routes/routes.js");

app.use(routes);


// Routes

// A GET route for scraping the echoJS website

app.get("/scrapArticles", function (req, res) {
    axios.get("https://www.nytimes.com/section/technology").then(function (response) {
        var $ = cheerio.load(response.data);
        // console.log(response.data);

        $(".css-imuvyx").each(function (i, element) {
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2")
                .text().trim();
            result.link = $(this)
                .find("a")
                .attr("href");
            result.paragraph = $(this)
                .find('.css-1mpkbmj')
                .text().trim();

            console.log(result);
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
    });
});

app.listen(PORT, function () {
    console.log("App now listening at http://localhost:" + PORT);
});