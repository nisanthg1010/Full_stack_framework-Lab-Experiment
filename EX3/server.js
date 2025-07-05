require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('./models/Student');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Image upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'views/uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Form routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/form1.html'));
});

app.post('/form2', upload.single('photo'), (req, res) => {
  req.session.student = {
    name: req.body.name,
    roll: req.body.roll,
    email: req.body.email,
    contact: req.body.contact,
    college: req.body.college,
    degree: req.body.degree,
    photo: `/uploads/${req.file.filename}`
  };
  res.redirect('/form2');
});

app.get('/form2', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/form2.html'));
});

app.post('/form3', (req, res) => {
  req.session.student.theoryMarks = [].concat(req.body.theoryMarks).map(Number);
  res.redirect('/form3');
});

app.get('/form3', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/form3.html'));
});

app.post('/submit', async (req, res) => {
  const labMarks = [].concat(req.body.labMarks).map(Number);
  const theoryMarks = req.session.student.theoryMarks;

  const total = [...labMarks, ...theoryMarks].reduce((a, b) => a + b, 0);
  const gpa = (total / (labMarks.length + theoryMarks.length)) / 10;

  const student = new Student({
    ...req.session.student,
    theoryMarks,
    labMarks,
    gpa,
    cgpa: gpa
  });

  await student.save();

  res.send(`
    <h1>Kongu Engineering College</h1>
    <h2>Department of Computer Applications</h2>
    <h3>Marksheet - Semester 3</h3>
    <p><strong>Name:</strong> ${student.name}</p>
    <p><strong>Roll No:</strong> ${student.roll}</p>
    <p><strong>College:</strong> ${student.college}</p>
    <img src="${student.photo}" width="120" height="150" alt="Student Photo" /><br><br>
    <strong>GPA:</strong> ${gpa.toFixed(2)}<br>
    <strong>CGPA:</strong> ${gpa.toFixed(2)}<br><br>
    <form action="/students"><button>📋 View Students</button></form>
  `);
});

// CRUD
app.get('/students', async (req, res) => {
  const students = await Student.find();
  let html = `
    <h1>📋 All Students</h1>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Photo</th><th>Name</th><th>Roll</th><th>College</th><th>GPA</th><th>Actions</th></tr>
  `;
  students.forEach(s => {
    html += `
      <tr>
        <td><img src="${s.photo}" width="70" /></td>
        <td>${s.name}</td>
        <td>${s.roll}</td>
        <td>${s.college}</td>
        <td>${s.gpa.toFixed(2)}</td>
        <td>
          <form method="POST" action="/students/${s._id}/delete" style="display:inline">
            <button>🗑️ Delete</button>
          </form>
          <form method="GET" action="/students/${s._id}/edit" style="display:inline">
            <button>✏️ Edit</button>
          </form>
        </td>
      </tr>
    `;
  });
  html += `</table><br><a href="/">➕ Add New Student</a>`;
  res.send(html);
});

app.post('/students/:id/delete', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
});

app.get('/students/:id/edit', async (req, res) => {
  const s = await Student.findById(req.params.id);
  res.send(`
    <h2>Edit Student: ${s.name}</h2>
    <form method="POST" action="/students/${s._id}/update">
      <input name="name" value="${s.name}" required /><br>
      <input name="roll" value="${s.roll}" required /><br>
      <input name="email" value="${s.email}" required /><br>
      <input name="contact" value="${s.contact}" required /><br>
      <input name="college" value="${s.college}" required /><br>
      <input name="degree" value="${s.degree}" required /><br>
      <button type="submit">Update ✅</button>
    </form>
  `);
});

app.post('/students/:id/update', async (req, res) => {
  const { name, roll, email, contact, college, degree } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, roll, email, contact, college, degree });
  res.redirect('/students');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Running at http://localhost:${PORT}`));
