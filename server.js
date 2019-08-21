var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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
    axios.get("https://www.espn.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        // console.log(response.data);

        $(".contentItem__content").each(function (i, element) {
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
           
            result.title = $(this)
                .find("h1")
                .text().trim();
            result.link = $(this)
                .find("a")
                .attr("href");
            result.paragraph = $(this)
                .find("p")
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

    db.Article.find({}, function (err, data) {
        // Log any errors if the server encounters one
        if (err) {
            console.log(err);
        } else {
            // Otherwise, send the result of this query to the browser
            res.json(data);
        }
    });


});
app.get("/articles", function (req, res) {
    db.Article.find({}, function (err, data) {
        // Log any errors if the server encounters one
        if (err) {
            console.log(err);
        } else {
            // Otherwise, send the result of this query to the browser
            res.json(data);
        }
    });
});
app.get('/saveArticle/:id',function(req,res){
    db.Article.find({_id: req.params.id},function(err,data){
        if(err){
            console.log(err);
        }
        else{
            res.json(data);
        }
    })
})
// app.post("/saveArticles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.SavedArticle.create(req.body)
//       .then(function(dbNote) {
//         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//       })
//       .then(function(dbArticle) {
//         // If we were able to successfully update an Article, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
  

app.listen(PORT, function () {
    console.log("App now listening at http://localhost:" + PORT);
});