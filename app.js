var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo  = require('mongodb').MongoClient;
const News = require('./models/news');
var url = "mongodb://localhost:27017/test";
var request = require('request');
var data = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const mongoose = require('mongoose');
var schedule = require('node-schedule');
mongoose.connect(url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var everyHour = '0 * * * *';
var everyMin = '*/1 * * * *';
var j = schedule.scheduleJob(everyHour, function(){
  var timeNow = new Date(Date.now()).toLocaleTimeString();
  console.log("TIME: " + timeNow);
  console.log('Checking for new articles...');
  console.log("Will check again in one hour");
  request(data,function(error,response,body){
    var news = JSON.parse(body);
    
    mongoose.connection.db.collection('news').count(function(err, count){

      if(count == 0){
        console.log("this collection is empty");
        for(var i in news.hits){
          var date = new Date(news.hits[i].created_at);
          var time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
          var url;
          if(news.hits[i].url == null)
          {
            url = news.hits[i].story_url;
          }
          else{
            url = news.hits[i].url;
          }
            var article = new News.News(
              {title:news.hits[i].title,
              story_title:news.hits[i].story_title,
              url:url,
              storyId:news.hits[i].objectID,
              author:news.hits[i].author,
              date:news.hits[i].created_at,
              time:time,
              isDeleted:0

              });
              console.log("Saving article:" + news.hits[i].objectID );
              article.save(function(err){
                if(err){
                  console.log(err);
                }
              })
              

        }
      }
      else{
        console.log("There are records in the database, checking if any of the requested ones are new...");
        for(var i in news.hits){
          News.News.find({storyId:news.hits[i].objectID},function(err, res){
            if(res.length >0){
              console.log("The article is already stored");
            }
            else{
              console.log("The article: " + news.hits[i].objectID + " is new.")
              var article = new News.News(
                {title:news.hits[i].title,
                story_title:news.hits[i].story_title,
                url:url,
                storyId:news.hits[i].objectID,
                author:news.hits[i].author,
                date:news.hits[i].created_at,
                time:time,
                isDeleted:0
  
                });
                console.log("Saving the article: " + news.hits[i].objectID);
                article.save(function(err){
                  if(err){
                    console.log(err);
                  }
                })
            }
          })
        }
      }
    })


  });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.locals.News = News;
module.exports = app;
