const renderList = require("../../templates/renderList");
const generateID = require("../../lib/generateNum");
const accepts = require("../../lib/accepts");
let { data } = require("../../data/data");

module.exports = (req, res) => {
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    if (accepts(req) === "json") {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(301, {
        Location: `${link.url}`,
      });
      res.end();
    } else {
      res.writeHead(301, {
        Location: `${link.url}`,
      });
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        status: 404,
        message: "Link not found",
      })
    );
  }
}