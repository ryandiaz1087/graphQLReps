const Query = {
  users(parent, args, { prisma }, info) {
    const operationArguments = {};

    if (args.query) {
      operationArguments.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          }
        ]
      }
    }
    return prisma.query.users(operationArguments, info);
  },

  posts(parent, args, { prisma }, info) {
    const operationArguments = {};

    if (args.query) {
      operationArguments.where = {
        OR: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          }
        ]
      }
    }

    return prisma.query.posts(operationArguments, info);
  },

  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
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