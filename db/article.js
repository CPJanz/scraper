// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var articleSchema = new Schema({
    author: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        trim: true,
    },
    date: {
        type: String,
        trim: true
    },
    blurb: {
        type: String,
        trim: true,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", articleSchema);

// Export the Example model
module.exports = Article;