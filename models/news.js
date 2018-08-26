var url = "mongodb://localhost:27017/test";
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
module.exports.News = News;
