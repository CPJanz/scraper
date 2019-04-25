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

app.get("/", function(req, res) {
  console.log("route hit!");
  db.Article.find({})
    .populate("notes")
    .then(function(dbArticle) {
      res.render("index", { articles: dbArticle });
    });
});

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
      db.Article.create(results)
        .catch(function(err) {
          console.log(err.code);
        })
        .then(function(data) {
          res.send("Articles scraped");
        });
    });
});

//Returns article whose id is passed as a param
app.get("/api/article/:id", function(req, res) {
  db.Article.findById(req.params.id)
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    });
});

app.delete("/api/deleteNote/", function(req, res) {
  db.Note.findByIdAndDelete(req.body.id)
    .then(function(data) {
      db.Article.findByIdAndUpdate(data.articleId, {
        $pullAll: { notes: [req.body.id] }
      });
    })
    .then(function(data) {
      res.send("Comment deleted");
    });
});

app.post("/api/addNote", function(req, res) {
  console.log("Attempting to add note");
  db.Note.create(req.body).then(function(note) {
    console.log(
      "added note, attempting to update article.",
      req.body.articleId
    );
    db.Article.findByIdAndUpdate(req.body.articleId, {
      $push: { notes: note._id }
    })
      .catch(function(err) {
        console.log(err);
      })
      .then(function(result) {
        res.send("Comment added");
      });
  });
});

app.delete("/api/deleteAll", function(req, res) {
  db.Article.remove({})
    .then(function(data) {
      db.Note.remove({});
    })
    .then(function(data) {
      res.send("Deleted all articles and notes.");
    });
});

app.get("*", function(req, res) {
  db.Article.find({})
    .populate("notes")
    .then(function(dbArticle) {
      res.render("index", { articles: dbArticle });
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
