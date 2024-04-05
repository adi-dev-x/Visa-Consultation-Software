var express = require('express');

const multer = require('multer');
const path = require('path');
var http = require('http');
var fs = require('fs');

var _require = require('./src/user'),
    User = _require.User;

var UserWithDb = new User();

var cors = require("cors");
var mail=require('./src/mailer')
var ma=mail.mailer
 var mails=new ma();
var app = express();
app.use(express.json());
app.use(cors());
const { PDFDocument } = require('pdf-lib');
const util = require('util');
const readFile = util.promisify(fs.readFile);
app.get('/', function (req, res) {
  return res.status(200).send({
    'message': 'YAY! Congratulations! Your first endpoint is working'
  });
});

app.post('/api/v1/users/postQuery', function (req, res) {
    UserWithDb.postQuery(req, res);
});

app.post('/api/v1/users/getQuery', function (req, res) {
    UserWithDb.getQuery(req, res);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.originalname);
    cb(null, file.originalname);
  },
});

//const upload = multer({ storage });
const upload = multer({ storage,
  limits: { fileSize: 10 * 1024 * 1024 } 

});
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// File upload route
app.post('/upload', upload.array('file'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  res.send('Files uploaded successfully.');
});
app.post('/api/v1/users/getbill', function (req, res) {
  mails.getbill(req, res);
});
app.post('/api/v1/users/getAppdetails', function (req, res) {
  mails.getAppdetails(req, res);
});

app.get('/image/:name', (req, res) => {
  
  const imagePath = path.join(__dirname, './uploads/'+req.params.name+''); // Update with the path to your image file
  console.log("this is image path",imagePath)
  res.sendFile(imagePath);
});
app.post('/api/v1/users/mergepdf', async (req, res) => {
  console.log("reached in the post api")
  const email=req.body.email;
  const project=req.body.project;
  try {
      const pdfFiles = req.body.pdfFiles;
      if (!pdfFiles || !Array.isArray(pdfFiles)) {
          throw new Error('Invalid PDF files data');
      }

      const mergedPdfBuffer = await mergePDFs(pdfFiles);
      console.log("going to sendEmailWithAttachment")
      await mails.sendEmailWithAttachment(mergedPdfBuffer,email,project);
      res.send('Email sent with merged PDF attachment');
  } catch (error) {
      console.error('Error merging PDFs:', error);
      res.status(500).send('Error merging PDFs');
  }
});

 async function mergePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();

  await Promise.all(pdfFiles.map(async (filename) => {
      try {
          const filePath = path.join(__dirname, 'uploads', filename);
          const pdfBytes = await readFile(filePath);
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
      } catch (error) {
          console.error(`Error reading PDF file ${filename}:`, error);
          // Handle the error accordingly, e.g., return a response indicating failure
      }
  }));

  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes; // Return the merged PDF buffer
} 
var pt_http = 2093;
//var pt_https =8443; // Default HTTPS port

// HTTP Server
var httpServer = http.createServer(app);
httpServer.listen(pt_http, function () {
  console.log('HTTP app running on port ', pt_http);
});
