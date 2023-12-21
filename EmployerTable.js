const mongoose = require('mongoose');

const EmployerTableSchema = new mongoose.Schema({
      EmployerID: {
        type: Number,
        required: true,
        unique: true,
      },
      UserID: {
        type: Number,
        required: true,
        ref: 'User',
      },
      CompanyName: {
        type: String,
        required: true,
      },
      Industry: {
        type: String,
        required: true,
      },
      CompanyWebsite: {
        type: String,
        required: true,
      },
      ContactInformation: {
        type: Number,
        required: true,
      },
      
});
const EmployerTable = new mongoose.model('EmployerTable', EmployerTableSchema, 'EmployerTable');

module.exports = EmployerTable;