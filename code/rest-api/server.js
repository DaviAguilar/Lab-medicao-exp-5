const express = require('express');
const cors = require('cors');
const data = require('../shared/data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple queries - single resource
app.get('/api/users', (req, res) => {
  res.json(data.getAllUsers());
});

app.get('/api/users/:id', (req, res) => {
  const user = data.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.get('/api/posts', (req, res) => {
  res.json(data.getAllPosts());
});

app.get('/api/posts/:id', (req, res) => {
  const post = data.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// Complex queries - nested resources
app.get('/api/users/:id/posts', (req, res) => {
  const user = data.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const posts = data.getPostsByAuthorId(req.params.id);
  res.json(posts);
});

app.get('/api/posts/:id/comments', (req, res) => {
  const post = data.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  const comments = data.getCommentsByPostId(req.params.id);
  res.json(comments);
});

// Very complex query - user with posts
app.get('/api/users/:id/with-posts', (req, res) => {
  const userWithPosts = data.getUserWithPosts(req.params.id);
  if (!userWithPosts) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(userWithPosts);
});

// Very complex query - post with author and comments
app.get('/api/posts/:id/with-details', (req, res) => {
  const postWithDetails = data.getPostWithAuthorAndComments(req.params.id);
  if (!postWithDetails) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(postWithDetails);
});

// All posts with authors
app.get('/api/posts/with-authors', (req, res) => {
  const posts = data.getAllPosts();
  const postsWithAuthors = posts.map(post => ({
    ...post,
    author: data.getUserById(post.authorId)
  }));
  res.json(postsWithAuthors);
});

app.listen(PORT, () => {
  console.log(`REST API server running on http://localhost:${PORT}`);
});

