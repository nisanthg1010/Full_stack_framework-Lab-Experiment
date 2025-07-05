const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.render('index', { blogs });
});

router.get('/view/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('view', { blog });
});

router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', async (req, res) => {
  const { title, content } = req.body;
  await Blog.create({ title, content });
  res.redirect('/');
});

module.exports = router;
