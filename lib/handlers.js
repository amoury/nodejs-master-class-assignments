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
  if(!dataObject.password && dataObject.Error) throw (dataObject.Error);
  let { phone, password } = dataObject;

  _data.read('users', phone)
    .then(() => {
      const hashedPassword = helpers.hash(password);
      if(!hashedPassword) return (500, {'Error' : 'Password couldnt be hashed'});
      
      delete dataObject.password;
      dataObject['hashedPassword'] = hashedPassword;

      _data.create('users', phone, dataObject)
        .then(() => (200));
    })
    .catch(err => console.log(err));

};

handlers._users.get = (data) => {
  return new Promise((resolve, reject) => {
    const phone = typeof data.queryString.phone == "string" && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
    if(!phone) return reject(new Error('Missing required field'), 400); 
    
    _data.read('users', phone)
    .then(result => {
      delete result.hashedPassword;
      resolve(result);
    })
    .catch(err => reject(new Error(err)))
  });
};

handlers._users.put = (data) => {
  return new Promise((resolve, reject) => {
    const validator = helpers.validateOptionalData(data.payload);
    if(validator !== true) return reject(new Error(validator.Error));
    
    let { phone } = data.payload;
    _data.read('users', phone)
    .then(userData => {
      delete data.payload.phone;
      for(key in data.payload) {
        if (key === 'password') userData.hashedPassword = helpers.hash(data.payload[key]);
        userData[key] = data.payload[key];
        delete userData.password;
      }
      
      _data.update('users', phone, userData)
      .then( message => {
        resolve(message);
      });
      
    })
    .catch(err => console.log(err.message))
  })
};


handlers._users.delete = data => {
  return new Promise((resolve, reject) => {
    const phone = typeof data.queryString.phone == "string" && data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;
    if(!phone) return reject(new Error('Missing required Fields'));

    _data.read("users", phone)
      .then(result => {
        
        _data.delete("users", phone)
          .then( message => {
            resolve(message);
          })
      })
      .catch( err => reject(new Error(err.message)));

  })
  
}

module.exports = handlers;