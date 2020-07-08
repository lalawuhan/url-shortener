const polka = require("polka");
const renderList = require("../templates/renderList");
const generateID = require("../lib/generateNum");
const accepts = require("../lib/accepts");
let { data } = require("../data/data");

const router = polka();

router.get("/", (req, res) => {
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
});

router.get("/links", (req, res) => {
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
});

router.get("/links/:id", (req, res) => {
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
});

router.post("/links", (req, res) => {
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
});

router.put("/links/:id", (req, res) => {
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
});

router.delete("/links/:id", (req, res) => {
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
});

//put and delete form
router.post("/links/put/:id", (req, res) => {
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
});

router.post("/links/delete/:id", (req, res) => {
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
});

module.exports = router;
