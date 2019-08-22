var express = require("express");
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


app.get("/", function (req, res) {
    res.render('index');
});

app.get("/scrapArticles", function (req, res) {
    var articleArray = [];
    axios.get("https://www.espn.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".contentItem__content").each(function (i, element) {

            var result = {};
            result.title = $(this)
                .find("h1")
                .text().trim();
            result.link = $(this)
                .find("a")
                .attr("href");
            result.paragraph = $(this)
                .find("p")
                .text().trim();

            // console.log(result);
            if(result.title){
                articleArray.push(result);
            }
            

        });
        // console.log(articleArray);
        return res.send(articleArray);
    });


});

app.get("/savedAritcles", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {

            res.render('savedAritcles', {
                articles: data
            });
        }
    });
});


app.post('/saveArticle', function (req, res) {
    console.log(req.body);
    let result = {
        title: req.body.article.title,
        link: req.body.article.link,
        paragraph: req.body.article.paragraph
    };

    db.Article.create(result)
        .then(function (dbArticle) {
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
});



app.listen(PORT, function () {
    console.log("App now listening at http://localhost:" + PORT);
});