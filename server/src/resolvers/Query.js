const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter((user) => user.name.toLowerCase().includes(args.query))
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter(post => {
      const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
      if (isTitleMatch || isBodyMatch) {
        return post;
      }
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export { Query as default };