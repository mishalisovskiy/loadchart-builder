const mongoose = require('mongoose');

const { Schema } = mongoose;

const UrlDataSchema = new Schema({
  logs: [
    {
      startDate: Date,
      endDate: Date,
      url: String,
      avgDelay: Number,
    }
  ]
});

module.exports = UrlData = mongoose.model('urlData', UrlDataSchema);
