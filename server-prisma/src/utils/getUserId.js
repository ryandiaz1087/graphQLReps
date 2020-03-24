import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  let header;
  if (request.request) {
    header = request.request.headers.authorization;
  } else {
    header = request.connection.context.Authorization;
  }
  
  if (header) {
    const token = header.replace('Bearer ', '');

    const decoded = jwt.verify(token, 'mysecret');
  
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required.')
  }

  return null;
}

export { getUserId as default };