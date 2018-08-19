/**
 * Library for storing and editing data
 */

//  Dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const openAsync = promisify(fs.open);
const writeFileAsync = promisify(fs.writeFile);
const closeAsync = promisify(fs.close);
const readFileAsync = promisify(fs.readFile);
const truncateAsync = promisify(fs.truncate);
const unlinkAsync = promisify(fs.unlink);

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = async (dir, file, data) => {
  try {
    const fileDescriptor = await openAsync(`${lib.baseDir}/${dir}/${file}.json`, "wx");
    let stringData = JSON.stringify(data);
    await writeFileAsync(fileDescriptor, stringData);
    await closeAsync(fileDescriptor);
    console.log(`This ${file}.json was successfully created`);

  } catch (err) {
    console.log("Error", err);
  }
};

lib.read = async (dir, file) => {
  try { 
    const fileData = await readFileAsync(`${lib.baseDir}${dir}/${file}.json`, 'utf-8');
    const parsedData = JSON.parse(fileData);
    console.log(parsedData);

  } catch (err) {
    console.log("Error: ", err.message);
  }
};

lib.update = async (dir, file, data) => {
  try {
    const fileDescriptor = await openAsync(`${lib.baseDir}/${dir}/${file}.json`, 'r+');

    let stringData = JSON.stringify(data);
    await truncateAsync(fileDescriptor);
    await writeFileAsync(fileDescriptor, stringData);
    await closeAsync(fileDescriptor);

  } catch (err) {
    console.log("Error: ", err.message);
  }
};

lib.delete = async (dir, file) => {
  try { 
    await unlinkAsync(`${lib.baseDir}/${dir}/${file}.json`);
    console.log('File Deleted Successfully');

  } catch (err) {
    console.log(err.message)
  }
}





module.exports = lib;