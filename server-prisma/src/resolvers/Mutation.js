import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

// const token = jwt.sign({ id: 46 }, 'mysecret');

// console.log(token);

// const decoded = jwt.decode(token);

// console.log(decoded);

// verify() decodes the token and verifies the secret making sure it came from us
// const decoded2 = jwt.verify(token, 'mysecret');

// console.log(decoded2)

// const dummy = async () => {
//   const email = 'ryno@gmail.com';
//   const password = 'red12345';

//   const hashedPassword = '$2a$10$utJrw7zsXrIpd4157skG8eTET3InkOo4hJag4ld6z0I5HsSrLg70e';

//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch)
// }

// dummy()

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });
    
    return {
      user,
      token: generateToken(userId),
    };
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('User was not found.');
    };

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (isMatch === false) {
      throw new Error('Unable to login');
    };

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const deletedUser = prisma.mutation.deleteUser({ where: { id: userId } }, info);

    return deletedUser;
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser({ where: { id: userId }, data: args.data }, info);
  },

  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info);
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({ id: args.id, author: { id: userId } });

    if (postExists === false) {
      throw new Error('Unable to delete post.');
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info);
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({ id: args.id, author: { id: userId } });

    const isPublished = await prisma.exists.Post({ id: args.id, published: true });

    if (postExists === false) {
      throw new Error('Unable to update post.');
    }

    if (isPublished === true && args.data.published === false) {
      await prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } });
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id,
      },
      data: args.data,
    }, info);
  },

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({ id: args.data.post, published: true });

    if (postExists === false) {
      throw new Error('Unable able to create comment.')
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId,
          }
        },
        post: {
          connect: {
            id: args.data.post,
          }
        }
      }
    }, info);
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({ id: args.id, author: { id: userId } });

    if (commentExists === false) {
      throw new Error('This comment needs authorization to be deleted.');
    }

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({ id: args.id, author: { id: userId } });

    if (commentExists === false) {
      throw new Error('This comment needs authorization to be updated.');
    }

    return prisma.mutation.updateComment({
      where: {
        id: args.id,
      },
      data: args.data,
    }, info);
  }
};

export { Mutation as default };
