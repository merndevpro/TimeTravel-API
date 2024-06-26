/* eslint-disable no-restricted-globals */
const { db } = require('../../utils/db');

function createBlog(blog) {
  return db.blog.create({
    data: blog,
  });
}
function addComment(comment) {
  return db.comment.create({
    data: comment,
  });
}
function getCount() {
  return db.blog.count();
}
function readAll(limit, pageNum) {
  limit = (limit < 1 || isNaN(limit)) ? 1 : limit;
  pageNum = (pageNum < 1 || isNaN(pageNum)) ? 1 : pageNum;

  const lastPos = (pageNum - 1) * limit;

  const result = db.blog.findMany({
    skip: lastPos,
    take: limit,
    select: {
      userId: true,
      title: true,
      description: true,
      banner: true,
      slug: true
    },
  });

  return result;
}
function readOne(blogSlug) {
  return db.blog.findUnique({
    where: {
      slug: blogSlug,
    },
    select: {
      id: true,
      userId: true,
      title: true,
      description: true,
      slug: true,
      banner: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      Comment: {
        select: {
          id: true,
          userId: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  });
}

module.exports = {
  createBlog,
  readAll,
  readOne,
  addComment,
  getCount,
};
