const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  image: {
    data: Buffer, // Store image data as Buffer
    contentType: String // Store image content type
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h' // Automatically delete after 1 hour
  }
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
