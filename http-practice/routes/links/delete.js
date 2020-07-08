const renderList = require("../../templates/renderList");
const generateID = require("../../lib/generateNum");
const accepts = require("../../lib/accepts");
let { data } = require("../../data/data");

module.exports = (req, res) => {
  let id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    let linkData = link;
    data = data.filter((link) => link.id != req.params.id);
    if (accepts(req) === "json") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: `${linkData.url} with id: ${linkData.id} deleted successfully.`,
          links: data,
        })
      );
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(
        `<p> ${linkData.url} with id: ${linkData.id} deleted successfully.</p>`
      );
      res.write(renderList(data));
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        status: 404,
        message: "Cannot delete link",
      })
    );
  }
}
