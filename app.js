//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to our vibrant community of knowledge seekers, dreamers, and storytellers! Here at Blog Worm, we believe in the power of words to inspire, educate, and connect. Dive into a world where curiosity knows no bounds, where every article is a journey waiting to be embarked upon. Join us as we explore the wonders of the human experience, share perspectives, and spark meaningful conversations. Together, let's unravel the threads of knowledge, one captivating blog post at a time. Welcome to Blog Worm, where inspiration meets enlightenment.";
const aboutContent = "Welcome to Blog Worm, your go-to destination for insightful content, thought-provoking discussions, and engaging narratives. Founded on the belief that knowledge should be shared and ideas should be explored, our platform serves as a digital haven for curious minds, avid learners, and passionate creators. Our team is comprised of dedicated individuals who are deeply passionate about the power of words and the impact of ideas. From technology to art, science to philosophy, and everything in between, we strive to cover a wide array of topics that stimulate intellect, spark creativity, and ignite meaningful conversations.";
const contactContent = "Email : blogworm@xyzmail.com, Phone : 9375476273";

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blogDB").then(function(err){
  console.log("Connected to database!");
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}).then(function(foundList){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundList
    });
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  Post.find({_id: requestedPostId}).then(function(post){
    res.render("post", {
      title: post[0].title,
      content: post[0].content
    });
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
