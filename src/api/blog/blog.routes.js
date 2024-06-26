const express = require('express');
const uniqid = require('uniqid');
const slugGenerator = require('slug');

const { validateBlogParams, validateCommentParams } = require('../../utils/validation');
const { isAuthenticated } = require('../../middlewares');
const {
  createBlog, addComment, readAll, readOne, getCount
} = require('./blog.services');

const router = express.Router();

router.post('/create', isAuthenticated, async (req, res, next) => {
  try {
    const validation = validateBlogParams(req.body);
    if (!validation.is_valid) {
      res.status(400);
      throw new Error(validation.error_msgs);
    }
    const {
      title,
      banner,
      description,
      content,
    } = req.body;
    const { userId } = req.payload;
    const slug = uniqid.process(`${slugGenerator(title, '_')}_`);
    await createBlog({
      userId, title, banner, description, content, slug
    });

    res.json({
      message: 'Adding Blog was successful'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/add_comment', isAuthenticated, async (req, res, next) => {
  try {
    const validation = validateCommentParams(req.body);
    if (!validation.is_valid) {
      res.status(400);
      throw new Error(validation.error_msgs);
    }
    const {
      blogId,
      comment
    } = req.body;
    const { userId } = req.payload;
    await addComment({
      userId, blogId, comment
    });

    res.json({
      message: 'Adding Blog was successful'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const {
      limit,
      pageNum
    } = req.query;

    const blogList = await readAll(Number(limit), Number(pageNum));
    const count = await getCount();

    res.json({ data: blogList, lastPage: limit * pageNum >= count });
  } catch (err) {
    next(err);
  }
});

router.get('/detail', async (req, res, next) => {
  try {
    const { slug } = req.body;
    const blogDetail = await readOne(slug);
    res.json(blogDetail);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
