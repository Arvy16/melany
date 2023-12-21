const mongoose = require('mongoose');

const UserTableSchema = new mongoose.Schema({
    UserID: {
        type: Number,
        required: true,
        unique: true,
      },
      FirstName: {
        type: String,
        required: true,
      },
      LastName: {
        type: String,
        required: true,
      },
      Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      Password: {
        type: String,
        required: true,
      },
      ContactInformation: {
        type: Number,
      },
      Resume: {
        type: String,
        required: true,
      },
      Role: {
        type: String,
        required: true,
      },
});
const UserTable = new mongoose.model('UserTable', UserTableSchema, 'UserTable');

module.exports = UserTable;
