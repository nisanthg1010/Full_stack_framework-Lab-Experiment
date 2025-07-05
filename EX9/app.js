const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let studentDetails = {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

const courses = [
  "datastructures", "c", "java", "csharp", "datascience", "cloudcomputing",
  "cn", "dbms", "devops", "designthinking", "ml", "dl", "blockchain"
];

app.get('/', (req, res) => {
  res.render('index', { courses });
});

app.post('/start-quiz', upload.single('photo'), (req, res) => {
  const course = req.body.course;
  studentDetails = {
    name: req.body.name,
    roll: req.body.roll,
    mobile: req.body.mobile,
    email: req.body.email,
    photo: '/uploads/' + req.file.filename,
    course: course
  };
  fs.readFile(`./quizzes/${course}.json`, 'utf8', (err, data) => {
    if (err) return res.send("Quiz not available.");
    const questions = JSON.parse(data);
    res.render('quiz', { questions, course });
  });
});

app.post('/submit-quiz', (req, res) => {
  const course = studentDetails.course;
  fs.readFile(`./quizzes/${course}.json`, 'utf8', (err, data) => {
    const questions = JSON.parse(data);
    let score = 0;
    questions.forEach((q, i) => {
      if (req.body[`q${i}`] === q.answer) score++;
    });
    res.render('result', { student: studentDetails, score, total: questions.length });
  });
});

app.listen(3000, () => console.log("http://localhost:3000"));
