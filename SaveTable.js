const mongoose = require('mongoose');

const SaveTableSchema = new mongoose.Schema({
    RelationID: {
        type: String,
        required: true,
        unique: true,
      },
      UserID: {
        type: String,
        required: true,
        refer: 'User',
      },
      JobID: {
        type: String,
        required: true,
        refer: 'Job',
      },
      SaveDate: {
        type: Date,
        required: true,
      },
     
});
const SaveTable = new mongoose.model('SaveTable', SaveTableSchema, 'SaveTable');

module.exports = SaveTable;
