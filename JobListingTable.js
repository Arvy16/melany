const mongoose = require('mongoose');

const JobListingTableSchema = new mongoose.Schema({
     JobID: {
        type: Number,
        required: true,
        unique: true,
      },
      EmployerID: {
        type: Number,
        required: true,
      },
      JobTitle: {
        type: String,
        required: true,
      },
      JobDescription: {
        type: String,
        required: true,
      },
      JobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contract'], 
        required: true,
      },
      Location: {
        type: String,
        enum: ['Full-City', 'State'], 
        required: true,
      },
      SalaryRange: {
        type: Number,
        required: true,
      },
      ApplicationDeadline: {
        type: Date,
        required: true,
      },
      ApplicationStatus: {
        type: String,
        required: true,
      },
 
});
const JobListingTable = new mongoose.model('JobListingTable', JobListingTableSchema, 'JobListingTable');

module.exports = JobListingTable;