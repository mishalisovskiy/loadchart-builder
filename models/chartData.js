const mongoose = require('mongoose');

const { Schema } = mongoose;

const chartDataSchema = new Schema({
  startDate: Date,
  endDate: Date,
  url: String,
  avgDelay: Number,
});

module.exports = ChartData = mongoose.model('chartData', chartDataSchema);
