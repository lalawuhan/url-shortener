const fs = require("fs");

let data;
try {
  data = JSON.parse(fs.readFileSync("data/links.json"));
} catch (err) {
  if (err.code === "ENOENT") {
    const err = new Error("File does not exist.");
    err.status = 404;
    throw err;
  } else {
    const err = new Error("Error reading data");
    throw err;
  }
}

module.exports.data = data;
