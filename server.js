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
        // console.log('Mongo db connected');
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

            if (result.title) {
                articleArray.push(result);
            }


        });
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
            // console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.delete("/api/Articles/:id", function (req, res) {
    let id = req.params.id;
    db.Article.remove({
            "_id": id
        })
        .then(function (data) {
            console.log('Record deleted');
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.post('/saveNote/:id',function(req,res){
    let newNote={
        articleId:req.body.note.articleId,
        body:req.body.note.body
    }
    // console.log(newNote);
    db.Notes.create(newNote)
    .then(function(data) {
      
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNotes._id }, { new: true });
    })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });

});

app.get('/api/notes/:id',function(req,res){
    let id = req.params.id;
    db.Notes.find({articleId:id},function(err,data){
        if(err){
            console.log(err);
        }else{
            res.send(data);
        }
    });
});



app.listen(PORT, function () {
    console.log("App now listening at http://localhost:" + PORT);
});