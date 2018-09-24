const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
    title:      String,
    author:     String,
    content:    String,
    visibility: String,
    tags:       {type : Array,  "default": []}
});

const Articles = mongoose.model('Articles', ArticlesSchema);

module.exports = Articles;
