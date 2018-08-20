const crypto = require('crypto');
const helpers = {};

helpers.validateData = data => {
  let { firstName, lastName, phone, password, tosAgreement } = data;
  
  firstName = typeof firstName == "string" && firstName.trim().length > 0 ? firstName.trim() : false;
  lastName = typeof lastName == "string" && lastName.trim().length > 0 ? lastName.trim() : false;
  phone = typeof phone == "string" && phone.trim().length == 10 ? phone.trim() : false;
  password = typeof password == "string" && password.trim().length > 0 ? password.trim() : false;
  tosAgreement = typeof tosAgreement == "boolean" && tosAgreement == true ? true : false;
  
  if (!firstName || !lastName || !phone || !password || !tosAgreement) return (400, {Error: "Missing required Fields"});
  return { firstName, lastName, phone, password, tosAgreement: true };
};


helpers.hash = password => {
  if (!typeof password == "string" && str.length > 0) return false;
  const hashingSecret = 'thisIsASecretKey'
  const hash = crypto
    .createHmac("sha256", hashingSecret)
    .update(password)
    .digest("hex");
  return hash;
};

helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

module.exports = helpers;
