var express = require("express");

var router = express.Router();

router.get("/",function(req,res){
    res.render('index');
})

router.get("/savedAritcles",function(req,res){
    res.render('savedAritcles');
})

module.exports = router;