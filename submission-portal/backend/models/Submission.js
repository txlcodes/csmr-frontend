const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  status: { type: String, default: 'Submitted' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Submission', submissionSchema); 