const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const data = require('../shared/data');

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent) {
        return data.getPostsByAuthorId(parent.id);
      }
    }
  })
});

// Post Type
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent) {
        return data.getUserById(parent.authorId);
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent) {
        return data.getCommentsByPostId(parent.id);
      }
    }
  })
});

// Comment Type
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLInt },
    text: { type: GraphQLString },
    postId: { type: GraphQLInt },
    authorId: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent) {
        return data.getUserById(parent.authorId);
      }
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Simple queries
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return data.getAllUsers();
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return data.getUserById(args.id);
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return data.getAllPosts();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return data.getPostById(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

