const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const httpServer = http.createServer((req, res) => serverOps(req, res));


const serverOps = (req, res) => {
  
  // 1. Get the path of the req URL
  const parsedURL = url.parse(req.url, true);

  const path = parsedURL.pathname.replace(/^\/+|\/+$/g, "");
  const queryString = parsedURL.query;

  // 2. Get the req METHOD to check if it is POST
  const method = req.method.toLowerCase();

  // 3. Get the headers
  const headers = req.headers;

  // 4. Get the payload
  getPayload(req, res)
    .then(result => {
      // 5. Handle Routing
      const chosenHandler = typeof router[path] !== "undefined" ? router[path] : handlers.notFound;
      const data = { path, queryString, method, headers, payload: result };
      
      chosenHandler(data, (statusCode, payload) => {
        statusCode = typeof statusCode == "number" ? statusCode : 200;
        payload = typeof payload == "object" ? payload: {};
        const payloadString = JSON.stringify(payload); 

        res.setHeader("Content-Tyype", "application/json");
        res.writeHead(statusCode);
        res.end(payloadString);
      })
      
    });
  };
  
  

/**
 * Returns a Promise to get Payload
 * @param {object} req 
 * @param {object} res 
 */
const getPayload = (req, res) => {
  return new Promise(( resolve, reject ) => {
    const decoder = new StringDecoder('utf-8');
      let buffer = "";
      
      req.on('data', data => buffer += decoder.write(data));
      req.on('end', () => { 
        buffer += decoder.end()
        resolve(buffer);
    });
  })
}





// Route Handler
const handlers = {};
handlers.hello = (data, callback) => {
  callback(200, {'message': 'Hello and Welcome to Node JS'});
}

// 404 Handler
handlers.notFound = (data, callback) => {
  callback(404);
}

const router = {
  hello: handlers.hello
}


httpServer.listen(3000, () => console.log(`The server is listening on the port 3000`));
