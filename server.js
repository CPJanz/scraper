const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const mongojs = require("mongojs");
const mongoose = require("mongoose");
const db = require("./db");

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/schemaexample", { useNewUrlParser: true });

function scrape() {
    axios.get("http://www.starcitygames.com/articles/tags/Select/").then(function(response) {
        const $ = cheerio.load(response.data);
        const results = [];
        $("article.articles").each(function(i, element) {
            const htmlParent = $(element).children("header");
            const newArticle = {
                author: htmlParent.children(".premium_author").text(),
                title: htmlParent.children(".premium_title").children("a").text(),
                link: htmlParent.children(".premium_title").children("a").attr("href"),
                avatar: htmlParent.children(".avatar").children("img").attr("src"),
                blurb: $(element).children("p").text(),
                date: htmlParent.children(".tag_article_date").text()
            };

            results.push(newArticle);
        })
        console.log(results)
    })
}

scrape();