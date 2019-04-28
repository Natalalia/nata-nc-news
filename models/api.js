const fs = require("fs");

const fetchEndPoints = (fileName, type) => {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, type, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

module.exports = { fetchEndPoints };
