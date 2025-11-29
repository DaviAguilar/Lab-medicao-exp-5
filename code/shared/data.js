// Shared data source for both APIs
// Simulating a database with in-memory data

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 },
  { id: 4, name: "Alice Williams", email: "alice@example.com", age: 28 },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", age: 32 }
];

const posts = [
  { id: 1, title: "First Post", content: "This is the first post content", authorId: 1, createdAt: "2024-01-01" },
  { id: 2, title: "Second Post", content: "This is the second post content", authorId: 1, createdAt: "2024-01-02" },
  { id: 3, title: "Third Post", content: "This is the third post content", authorId: 2, createdAt: "2024-01-03" },
  { id: 4, title: "Fourth Post", content: "This is the fourth post content", authorId: 2, createdAt: "2024-01-04" },
  { id: 5, title: "Fifth Post", content: "This is the fifth post content", authorId: 3, createdAt: "2024-01-05" },
  { id: 6, title: "Sixth Post", content: "This is the sixth post content", authorId: 3, createdAt: "2024-01-06" },
  { id: 7, title: "Seventh Post", content: "This is the seventh post content", authorId: 4, createdAt: "2024-01-07" },
  { id: 8, title: "Eighth Post", content: "This is the eighth post content", authorId: 4, createdAt: "2024-01-08" },
  { id: 9, title: "Ninth Post", content: "This is the ninth post content", authorId: 5, createdAt: "2024-01-09" },
  { id: 10, title: "Tenth Post", content: "This is the tenth post content", authorId: 5, createdAt: "2024-01-10" }
];

const comments = [
  { id: 1, text: "Great post!", postId: 1, authorId: 2, createdAt: "2024-01-01" },
  { id: 2, text: "I agree", postId: 1, authorId: 3, createdAt: "2024-01-01" },
  { id: 3, text: "Nice work", postId: 2, authorId: 4, createdAt: "2024-01-02" },
  { id: 4, text: "Well said", postId: 3, authorId: 1, createdAt: "2024-01-03" },
  { id: 5, text: "Interesting", postId: 4, authorId: 5, createdAt: "2024-01-04" }
];

// Helper functions to get data
function getUserById(id) {
  return users.find(u => u.id === parseInt(id));
}

function getAllUsers() {
  return users;
}

function getPostById(id) {
  return posts.find(p => p.id === parseInt(id));
}

function getAllPosts() {
  return posts;
}

function getPostsByAuthorId(authorId) {
  return posts.filter(p => p.authorId === parseInt(authorId));
}

function getCommentsByPostId(postId) {
  return comments.filter(c => c.postId === parseInt(postId));
}

function getUserWithPosts(userId) {
  const user = getUserById(userId);
  if (!user) return null;
  return {
    ...user,
    posts: getPostsByAuthorId(userId)
  };
}

function getPostWithAuthorAndComments(postId) {
  const post = getPostById(postId);
  if (!post) return null;
  return {
    ...post,
    author: getUserById(post.authorId),
    comments: getCommentsByPostId(postId)
  };
}

module.exports = {
  users,
  posts,
  comments,
  getUserById,
  getAllUsers,
  getPostById,
  getAllPosts,
  getPostsByAuthorId,
  getCommentsByPostId,
  getUserWithPosts,
  getPostWithAuthorAndComments
};

