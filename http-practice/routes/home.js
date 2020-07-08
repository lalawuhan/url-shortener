const renderList = require("../templates/renderList");
const generateID = require("../lib/generateNum");
const accepts = require("../lib/accepts");
let { data } = require("../data/data");

module.exports = (req, res) => {
  if (accepts(req) === "json") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        links: data,
      })
    );
  } else {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(renderList(data));
  }
}
