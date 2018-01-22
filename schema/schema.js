const graphql = require('graphql');
const axios = require('axios');

const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull } = graphql;
const api = 'http://localhost:3000';

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parentValue) {
        return axios.get(`${api}/authors/${parentValue.authorId}`).then(res => res.data);
      },
    },
  }),
});

const PageType = new GraphQLObjectType({
  name: 'Page',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parentValue) {
        return axios.get(`${api}/authors/${parentValue.authorId}`).then(res => res.data);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parentValue) {
        return axios.get(`${api}/authors/${parentValue.id}/posts`).then(res => res.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        return axios.get(`${api}/posts/${args.id}`).then(res => res.data);
      },
    },
    page: {
      type: PageType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        return axios.get(`${api}/pages/${args.id}`).then(res => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { name }) {
        return axios.post(`${api}/authors`, { name }).then(res => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
