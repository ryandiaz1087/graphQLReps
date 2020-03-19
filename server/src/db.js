let users = [
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

let posts = [
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

let comments = [
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };