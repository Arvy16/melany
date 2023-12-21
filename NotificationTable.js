const mongoose = require('mongoose');

const NotificationTableSchema = new mongoose.Schema({
    NotificationID: {
        type: String,
        required: true,
        unique: true,
      },
      UserID: {
        type: String,
        required: true,
        refer: 'User',
      },
      NotificationType: {
        type: String,
        required: true,
      },
      Content: {
        type: String,
        required: true,
      },
      Timestamp: {
        type: Date,
        required: true,
        default: Date.now
      },
      Status: {
        type: String,
        required: true,
      }, 
});
const NotificationTable = new mongoose.model('NotificationTable', NotificationTableSchema, 'NotificationTable');

module.exports = NotificationTable;
