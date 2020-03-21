import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

prisma.exists.Comment({
  id: "abvasd",
}).then((exists) => {
  console.log(exists);
})

prisma.query, prisma.mutation, prisma.subscription, prisma.exists

 const createPostForUser = async (authorId, data) => {
   const userExists = await prisma.exists.User({ id: authorId });

   if (!userExists) {
     throw new Error('User not found');
   }
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId,
        }
      }
    },
  }, `{ author { id name email posts { id title published } } }`);

  return post.author;
 }

 createPostForUser("ck80khe7z00rt0991jen7jmgb", {
   title: "Great books to read",
   body: "The War of ARt",
   published: true,
 }).then(user => {
   console.log(JSON.stringify(user, undefined, 2))
 }).catch(err => {
  console.log(err);
 })

 const updatePostForUser = async (postId, data) => {
   const postExists = prisma.exists.Post({
     id: postId,
   });

   if (!postExists) {
     throw new Error('This post was not found...');
   }

   const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
      data,
    }, `{ author { id name email posts { id title published } } }`);

   return post.author;
 }

 updatePostForUser("ck823ryk501s309913zd7e1yq", {
   title: "Shitty books to read",
   body: "poopp and read type of books",
   published: false,
 }).then(data => {
   console.log(JSON.stringify(data, undefined, 2));
 }).catch(err => console.log(err))

// prisma.mutation.createPost({
//   data: {
//     title: "COVID-19!",
//     body: "FUck the coronavirus!",
//     published: true,
//     author: {
//       connect: {
//         id: "ck80khe7z00rt0991jen7jmgb"
//       }
//     }
//   }
// }, `{
//   id
//   title
//   body
//   published
// }`).then(data => {
//   console.log(data);
//   return prisma.query.users(null, `{
//     id
//     name
//     posts {
//       id
//       title
//     }
//   }`)
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation.updatePost({
//   data: {
//     body: "COVID-19 is CONQUERED!",
//     published: true,
//   },
//   where: {
//     id: "ck821pejf00zc09915z6ddbu8"
//   }
// }, `{
//   id
//   title
//   body
//   published
//   author {
//     id
//     name
//     email
//   }
// }`).then(() => {
//   return prisma.query.posts(null, `{
//     id
//     title
//     body
//     published
//   }`)
// }).then(data => {
//   console.log(data);
// })