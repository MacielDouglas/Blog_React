export const errorHandler = (statusCode, message) => ({
  message,
  statusCode,
});

// export const errorHandler = (statusCode, message) => {
//   const error = new Error();
//   error.statusCode = statusCode;
//   error.message = message;
//   return error;
// };
