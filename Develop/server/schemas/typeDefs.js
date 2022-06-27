const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: ID!
    title: String
    image: String
    link: String
  }

  type Book {
    authors: [String]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String
  }

  type Query {
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(bookData: BookInput): User
    removeBook(bookId: ID): User
  }
`;

module.exports = typeDefs;