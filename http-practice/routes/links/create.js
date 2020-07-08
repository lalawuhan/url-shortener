const renderList = require("../../templates/renderList");
const generateID = require("../../lib/generateNum");
const accepts = require("../../lib/accepts");
let { data } = require("../../data/data");

module.exports = (req, res) => {
  if (req.headers["content-length"] === "0") {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Data is empty",
      })
    );
  } else {
    let body = req.body.url;
    let newLink = {
      id: generateID(data),
      url: body,
    };
    data.push(newLink);
    if (accepts(req) === "json") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          status: res.statusCode,
          message: `Link successfully added`,
          links: data,
        })
      );
    } else {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(
        `<p>${newLink.url} successfully added. Id is ${newLink.id}</p>`
      );
      res.write(renderList(data));
      res.end();
    }
  }
}
