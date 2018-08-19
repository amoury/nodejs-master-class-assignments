/**
 * Request Handlers
 */


// Dependencies

// Route Handlers
const handlers = {};
handlers.hello = (data, callback) => {
  callback(200, { message: "Hello and Welcome to Node JS" });
};

// 404 Handler
handlers.notFound = (data, callback) => {
  callback(404);
};

handlers.users = (data, callback) => {
  callback(200, { message: "welcome users" });
}

module.exports = handlers;