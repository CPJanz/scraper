// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var noteSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
  articleId: {
    type: String
  }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

// Export the Example model
module.exports = Note;
