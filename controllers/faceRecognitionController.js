// const asyncHandler = require('express-async-handler');
// const { spawn } = require('child_process');
// const mongoose = require('mongoose');
// const ImageModel = require('../models/imageModel');

// // Function to save the image to the database
// const saveImageToDatabase = async (classId, image) => {
//   const newImage = new ImageModel({
//     classId,
//     image: {
//       data: Buffer.from(image, 'base64'),
//       contentType: 'image/jpeg'
//     }
//   });
//   await newImage.save();
//   return newImage;
// };

// // Function to perform face recognition using the saved image ID
// const performFaceRecognitionWithImageId = async (classId, imageId) => {
//   const pythonProcess = spawn('python', ['./face-detection/faceRecognition.py', classId, imageId]);

//   let outputData = '';
//   let errorData = '';

//   pythonProcess.stdout.on('data', (data) => {
//     outputData += data.toString();
//   });

//   pythonProcess.stderr.on('data', (data) => {
//     errorData += data.toString();
//   });

//   return new Promise((resolve, reject) => {
//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         console.error(`Python script exited with code ${code}: ${errorData}`);
//         reject(new Error('Error recognizing face'));
//       } else {
//         try {
//           const recognizedStudents = JSON.parse(outputData);
//           resolve(recognizedStudents);
//         } catch (error) {
//           console.error(`Error parsing Python script output: ${error}`);
//           reject(new Error('Error parsing Python script output'));
//         }
//       }
//     });
//   });
// };

// // Handler for performing face recognition
// const performFaceRecognition = asyncHandler(async (req, res) => {
//   const { classId } = req.params;
//   const { image } = req.body;

//   try {
//     // Save the image to the database
//     const savedImage = await saveImageToDatabase(classId, image);

//     // Perform face recognition using the saved image's ID
//     const recognizedStudents = await performFaceRecognitionWithImageId(classId, savedImage._id.toString());

//     // Delete the saved image from the database
//     await ImageModel.findByIdAndDelete(savedImage._id);

//     // Send the recognized students back as a response
//     res.status(200).json({ success: true, studentNames: recognizedStudents });
//   } catch (error) {
//     console.error(`Error in performFaceRecognition: ${error}`);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = { performFaceRecognition };






const asyncHandler = require('express-async-handler');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const performFaceRecognition = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { image } = req.body;

  // Define the directory where images will be saved
  const imagesDirectory = path.join(__dirname, 'imagesTaken');

  // Create the directory if it doesn't exist
  if (!fs.existsSync(imagesDirectory)) {
    fs.mkdirSync(imagesDirectory);
  }

  const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
  const fileName = 'captured_image.jpg';
  const filePath = path.join(imagesDirectory, fileName);
  
  // Write the image to a file
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save image');
    } else {
      console.log('Image saved successfully');
      
      // Call the Python script with the image path and class ID as arguments
      const pythonProcess = spawn('python', ['./face-detection/faceRecognition.py', classId, filePath]);

      pythonProcess.stdout.on('data', (data) => {
        const recognizedNames = JSON.parse(data.toString());
        fs.unlinkSync(filePath); // Delete the saved image
        console.log('Recognized Names:', recognizedNames); // Print recognized names to console
        res.json({ success: true, recognizedNames });
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        res.status(500).json({ success: false, message: 'Error recognizing faces' });
      });
    }
  });
});

module.exports = { performFaceRecognition };























// // controllers/faceRecognitionController.js
// const asyncHandler = require('express-async-handler');
// // const { PythonShell } = require('python-shell');
// const { spawn } = require('child_process');

// const performFaceRecognition = asyncHandler(async (req, res) => {
//   const { classId } = req.params;
//   const { image } = req.body;



//   const pythonProcess = spawn('python', ['./face-detection/faceRecognition.py', classId]);

//   pythonProcess.stdout.on('data', (data) => {
//     console.log(`Python script output: ${data}`);
//     // Parse the data if necessary and send it back to the client
//     res.status(200).json({ success: true, data: data });
//   });

//   pythonProcess.stderr.on('data', (data) => {
//     console.error(`Error executing Python script: ${data}`);
//     res.status(500).json({ success: false, error: data });
//   });

//   pythonProcess.on('close', (code) => {
//     console.log(`Python script exited with code ${code}`);
//   });



// //   const options = {
// //     mode: 'text',
// //     pythonOptions: ['-u'],
// //     scriptPath: './face-detection', // Path to your Python script directory
// //     args: [classId] // Pass arguments to your Python script
// //   };

// //   PythonShell.run('faceRecognition.py', options, (err, results) => {
// //     if (err) {
// //       console.error('Error executing Python script:', err);
// //       res.status(500).json({ success: false, message: 'Error executing Python script' });
// //     } else {
// //       console.log('Python script output:', results);
// //       const studentName = results; // Assuming the Python script returns the student name
// //       res.status(200).json({ success: true, studentName });
// //     }
// //   });
// });

// module.exports = { performFaceRecognition };


// const asyncHandler = require('express-async-handler');
// const { spawn } = require('child_process');
// const mongoose = require('mongoose');
// const ImageModel = require('../models/imageModel');

// const performFaceRecognition = asyncHandler(async (req, res) => {
//   const { classId } = req.params;
//   const { image } = req.body;

//   try {
//     const newImage = new ImageModel({
//       classId,
//       image: {
//         data: Buffer.from(image, 'base64'),
//         contentType: 'image/jpeg'
//       }
//     });
//     await newImage.save();

//     const savedImage = await ImageModel.findOne({ classId }).sort({ createdAt: -1 });

//     if (!savedImage) {
//       return res.status(404).json({ success: false, message: 'Image not found after saving.' });
//     }

//   //   const pythonProcess = spawn('python', ['./face-detection/faceRecognition.py', classId, savedImage._id.toString()]);

//   //   let outputData = '';
//   //   let errorData = '';

//   //   pythonProcess.stdout.on('data', (data) => {
//   //     outputData += data.toString();
//   //   });

//   //   pythonProcess.stderr.on('data', (data) => {
//   //     errorData += data.toString();
//   //   });

//   //   pythonProcess.on('close', async (code) => {
//   //     if (code !== 0) {
//   //       console.error(`Python script exited with code ${code}: ${errorData}`);
//   //       if (!res.headersSent) {
//   //         return res.status(500).json({ success: false, message: 'Error recognizing face' });
//   //       }
//   //     } else {
//   //       try {
//   //         const recognizedStudents = JSON.parse(outputData);
//   //         res.status(200).json({ success: true, studentNames: recognizedStudents });
//   //       } catch (error) {
//   //         console.error(`Error parsing Python script output: ${error}`);
//   //         res.status(500).json({ success: false, message: 'Error parsing Python script output' });
//   //       }
//   //     }

//   //     await ImageModel.findByIdAndDelete(savedImage._id);
//   //   });

//   } catch (error) {
//     console.error(`Error in performFaceRecognition: ${error}`);
//     if (!res.headersSent) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// });

// module.exports = { performFaceRecognition };
