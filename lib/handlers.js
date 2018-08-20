/**
 * Request Handlers
 */


// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Route Handlers
const handlers = {};
handlers.hello = (data, callback) => {
  callback(200, { message: "Hello and Welcome to Node JS" });
};

// 404 Handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// @TODO work on this in Progress

handlers.users = (data) => {
  return new Promise( (resolve, reject ) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(!acceptableMethods.indexOf(data.method) <= -1) reject(405);
    resolve(handlers._users[data.method](data));
  })
}

handlers._users = {};

handlers._users.post = (data) => {
  const dataObject = helpers.validateData(data.payload);
  let { phone, password } = dataObject;

  _data.read('users', phone)
    .then(() => {
      const hashedPassword = helpers.hash(password);
      if(!hashedPassword) return (500, {'Error' : 'Password couldnt be hashed'});

      _data.create('users', phone, dataObject)
        .then(() => (200));
    })
    .catch(err => console.log(err));

}

module.exports = handlers;