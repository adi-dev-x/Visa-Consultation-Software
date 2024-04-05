const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

const app = express();
var serviceAccount = require("./file.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://dashboard-cfa4f.appspot.com", 
  //databaseURL: "https://amal-484bc-default-rtdb.firebaseio.com"
});
const bucket = admin.storage().bucket();
// Multer storage configuration
const storage = multer.memoryStorage();
// Initialize multer with storage configuration
const upload = multer({ storage: storage });
//bucket.upload("/Users/adwaithadithyan/Desktop/firebase/h.png")
// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Check if file was uploaded
 console.log("inside")
 if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  const fileName = file.originalname;

  // Upload the file to Firebase Storage
  const fileUpload = bucket.file('uploads/' + fileName);
  const fileStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  fileStream.on('error', (error) => {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  });

  fileStream.on('finish', () => {
    // Get the public URL of the uploaded file
    const fileLink = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    res.send(fileLink);
  });

  fileStream.end(file.buffer);
});

app.listen('5757', () => {
  console.log(`Server is running on port `);
});
