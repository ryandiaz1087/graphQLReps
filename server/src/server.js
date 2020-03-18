import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const users = [
  {
    id: '1',
    name: 'Ryan',
    email: 'example@mail.com',
    age: 30,
    posts: [
      {
        id: '10',
        title: 'Graphql 101',
        body: 'This is how to use GraphQL',
        published: true,
        author: '1',
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'Sarah@mail.com',
    age: 40,
    posts: [
      {
        id: '11',
        title: 'Graphql 201',
        body: 'This is how to use GraphQL',
        published: true,
        author: '2',
      }
    ]
  },
  {
    id: '3',
    name: 'Mike',
    email: 'Mike@mail.com',
    age: 20,
    posts: [
      {
        id: '12',
        title: 'Programming music',
        body: 'This is an advanced GraphQL post....',
        published: false,
        author: '3',
      }
    ]
  }
];

const posts = [
  {
    id: '10',
    title: 'Graphql 101',
    body: 'This is how to use GraphQL',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'Graphql 201',
    body: 'This is how to use GraphQL',
    published: true,
    author: '2',
  },
  {
    id: '12',
    title: 'Programming music',
    body: 'This is an advanced GraphQL post....',
    published: false,
    author: '3',
  },
];

const comments = [
  {
    id: '111',
    textField: 'Thanks for the tutorial!!!',
    post: '11',
    author: '3',
  },
  {
    id: '222',
    textField: 'Really! This tutorial is amazing!!!',
    post: '11',
    author: '3',
  },
  {
    id: '333',
    textField: '... This tutorial is aight',
    post: '12',
    author: '1',
  },
  {
    id: '444',
    textField: 'This tutorial is super whatever...',
    post: '10',
    author: '1',
  },
];

const typeDefs = `
  type Query {
    users(query: String): [User]!
    posts(query: String): [Post]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(textField: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment]
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    textField: String!
    post: Post!
    author: User!
  }
`;



const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter ((user) => user.name.toLowerCase().includes(args.query))
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
        if (isTitleMatch || isBodyMatch) {
          return post;
        }
      })
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: 1,
        name: 'Ryan Diaz',
        email: 'ryan.anthony.diaz@gmail.com',
        age: 30,
      }
    },
    post() {
      return {
        id: 92,
        title: 'GraphQL 101',
        body: 'This is the post content',
        published: true,
      }
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email.toLowerCase() === args.email.toLowerCase());

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found..');
      }

      const post = {
        id: uuidv4(),
        ...args,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const { textField, author, post } = args;

      const userExists = users.some(user => user.id === author);
      const postExists = posts.some(pst => pst.id === post && pst.published);

      if (!postExists || !userExists) {
        return new Error('Could not find user and/or post...');
      };

      const newComment = {
        id: uuidv4(),
        textField,
        author,
        post,
      };

      comments.push(newComment);

      return newComment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    },
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up...')
})