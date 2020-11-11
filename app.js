const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const { strict } = require('assert');
const { nextTick } = require('process');

// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

// Init Upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	fileFilter: (req, file, cb) => {
		console.log(file);
		checkFileType(file, cb);
	},
}).single('file');

// Check File Type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /docx|doc|pdf|odt|txt|pptx|ppt|ods|xls|xlsx|rtf|/;
	// Check ext
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.render('index', {
				msg: err,
			});
		} else {
			if (req.file == undefined) {
				res.render('index', {
					msg: 'Error: No File Selected!',
				});
			} else {
				res.render('index', {
					msg: 'File Uploaded!',
					file: `uploads/${req.file.filename}`,
				});
			}
		}
	});
});

const port = 5000;

app.listen(port, () => {
	console.log(`server Started on port ${port}`);
});
