const express = require('express');
const exphbs  = require('express-handlebars');
const multer  = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Serve form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/form.html');
});

// Handle form submission
app.post('/submit', upload.fields([{ name: 'resume' }, { name: 'photo' }]), (req, res) => {
  const data = {
    name: req.body.name,
    rollno: req.body.rollno,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    favColor: req.body.favColor,
    resume: req.files['resume'][0].filename,
    photo: req.files['photo'][0].filename
  };

  fs.writeFileSync('./views/data.json', JSON.stringify(data, null, 2));
  res.render('display', data);
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
