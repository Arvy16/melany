const mongoose = require('mongoose');

const JobAppSchema = new mongoose.Schema({
      ApplicationID: {
        type: Number,
        required: true,
        unique: true,
      },
      UserID: {
        type: Number,
        required: true,
      },
      JobID: {
        type: Number,
        required: true,
      },
      ApplicationTimeDate: {
        type: Date,
        required: true,
      },
      StartTime: {
        type: String,
        required: true,
      },
      EndTime: {
        type: String,
        required: true,
      },
      CoverLetter: {
        type: String,
        required: true,
      },
      ApplicationStatus: {
        type: String,
        enum: ['Submitted', 'UnderReview', 'Rejected', 'Hired'], 
        required: true,
      },
});
const JobApp = new mongoose.model('JobApp', JobAppSchema, 'JobApp');

module.exports = JobApp;
