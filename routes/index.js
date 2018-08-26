var express = require('express');
var router = express.Router();
var request = require('request');
var data = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const mongoose = require('mongoose');
// var url = "mongodb://localhost:27017/test";
// var mon = mongoose.connect(url);
const News = require('../models/news');


/* GET home page. */

router.get('/', function(req, res, next) {
  request(data,function(error,response,body){
    console.log(JSON.parse(response.statusCode));
    var data = JSON.parse(body);
    // const News = res.app.locals.News;
    var arr;
    // News.News.find({isDeleted: 0},function(err,arts){
    News.News.find({isDeleted: 0}).sort({date:-1}).exec(function(err,arts){
      if(arts){
        console.log(arts);
      }
      res.render('index', 
              { title: 'HN Feed',
                subtitle:'We <3 Hacker News!',
                test:data.hits,
                test2:arts

            
            });

    })
    // console.log(data.hits);
    

  });

});

router.post('/delete',function(req,res,next){
  console.log("TEST");
  console.log(req.body.id);
  var query = {storyId:req.body.id};
  console.log(query);
  var update =  News.News.findOneAndUpdate(query,{isDeleted:1},function(err,doc){
    if(err){
      console.log(err);
    }
    else if (doc != null){
      console.log(doc.length);
      res.status(200).send('OK');
    }
    else{
      res.status(500).send('There was an error deleting the row');
    }

  })
});


module.exports = router;
