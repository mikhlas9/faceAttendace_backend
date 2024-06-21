// routes/faceRecognitionRoutes.js
const express = require('express');
const router = express.Router();
const { performFaceRecognition } = require('../controllers/faceRecognitionController');

router.route("/class/:classId").post(performFaceRecognition);


module.exports = router;
