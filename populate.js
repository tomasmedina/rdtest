var url = "mongodb://localhost:27017/test";
var request = require('request');
var data = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const mongoose = require('mongoose');
mongoose.connect(url);

var News = mongoose.model('News',{
    title:String,
    story_title:String,
    url:String,
    storyId:String,
    author:String,
    date:String,
    time:String,
    isDeleted:Number
    
  
  });


request(data,function(error,response,body){
    // console.log(JSON.parse(response.statusCode));
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
            var article = new News(
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
        console.log("Finished adding the articles, to add new ones please run the app.js file");
        return process.exit();
      }
      else{
        console.log("To add new data please run the app.js file");
        return process.exit();
      }
    })


  });