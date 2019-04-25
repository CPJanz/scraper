const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const db = require("./db");
const PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes

app.get("/api/scrape", function(req, res) {
  axios
    .get("http://www.starcitygames.com/articles/tags/Select/")
    .then(function(response) {
      console.log("Articles scraped!");
      const $ = cheerio.load(response.data);
      const results = [];
      $("article.articles").each(function(i, element) {
        const htmlParent = $(element).children("header");
        const newArticle = {
          author: htmlParent.children(".premium_author").text(),
          title: htmlParent
            .children(".premium_title")
            .children("a")
            .text(),
          link: htmlParent
            .children(".premium_title")
            .children("a")
            .attr("href"),
          avatar: htmlParent
            .children(".avatar")
            .children("img")
            .attr("src"),
          blurb: $(element)
            .children("p")
            .text(),
          date: htmlParent.children(".tag_article_date").text()
        };
        results.push(newArticle);
      });
      db.Article.create(results).catch(function(err) {
        console.log(err.code);
      });
      res.json(results);
    });
});

app.get("/api/article/:id", function(req, res) {
  db.Article.findById(req.params.id)
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    });
});

app.get("*", function(req, res) {
  db.Article.find({}).then(function(dbArticle) {
    res.render("index", { articles: dbArticle });
  });
});

app.delete("/api/deleteNote/:id", function(req, res) {
  const removedPost = db.Note.findByIdAndDelete(req.params.id);
  db.Article.findByIdAndUpdate(removedPost.articleId, {
    $pullAll: { notes: [req.params.id] }
  });
});

app.delete("/api/deleteAll", function(req, res) {
  //TODO: Delete
  // db.Article.remove({}).then(function(result) {
  //     db.Note.remove({})
  // }).then(function ())
  // res.text("Deleted all articles and notes.")
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
