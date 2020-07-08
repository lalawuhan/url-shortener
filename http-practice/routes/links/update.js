const renderList = require("../../templates/renderList");
const generateID = require("../../lib/generateNum");
const accepts = require("../../lib/accepts");
let { data } = require("../../data/data");

module.exports = (req, res) => {
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    let body = req.body;
    let newLink = body.url;
    let prevLink = link.url;
    link.url = newLink;
    if (accepts(req) === "json") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: `${prevLink} successfully updated to ${newLink}.`,
          links: data,
        })
      );
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(`<p>${prevLink} successfully updated to ${newLink}.</p>`);
      res.write(renderList(data));
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        status: 404,
        message: "Cannot update link",
      })
    );
  }
}
