const polka = require("polka");
const bodyParser = require("body-parser");
const path = require("path");

const app = polka({
  onError(err, req, res, next) {
    const http = require("http");
    console.log(err);
    let code = (res.statusCode = err.code || err.status || 500);
    res.end((err.length && err) || err.message || http.STATUS_CODES[code]);
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000;
const generateID = require("./generateNum.js");
const fs = require("fs");
const dataPath = "./data/links.json";
const homePage = path.join(__dirname, "index.html");

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

function accepts(req) {
  if (req.headers.accept.indexOf("application/json") !== -1) {
    return "json";
  } else {
    return "html";
  }
}

function renderList(data) {
  return `<body>
  <ul>
  ${data.map((el) => {
    return `
    <li> <strong>url:</strong> ${el.url}</li>
    <li> <strong>id:</strong> ${el.id}</li>
    `;
  })}
  </ul>
  </body>
  `;
}
app.get("/", (req, res) => {
  fs.readFile(homePage, { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      if (accepts(req) === "json") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            links: data,
          })
        );
      }
    } else {
      console.log(err);
    }
  });
});

app.get("/links", (req, res) => {
  if (accepts(req) === "json") {
    console.log("accepts json");
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

app.get("/links/:id", (req, res) => {
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
//TODO: accept headers, maybe add accept middleware, app.ise req.accept =  accepts(req)

//TODO: moved template strings
app.post("/links", (req, res) => {
  console.log("headers", req.headers);
  console.log("content", req.headers["content-type"]);
  if (req.headers["content-length"] === "0") {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "Data is empty",
      })
    );
  }
  if (accepts(req) === "json") {
    res.end(
      JSON.stringify({
        status: res.statusCode,
        message: `Link successfully added`,
      })
    );
  } else {
    try {
      let body = req.body.longurl;
      let newLink = {
        id: generateID(data),
        url: JSON.parse(body),
      };
      data.push(newLink);
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(
        `<p>${newLink.url} successfully added. Id is ${newLink.id}</p>`
      );
      res.write(renderList(data));
      res.end();
    } catch (err) {
      console.error(err);
    }
  }
});

app.put("/links/:id", (req, res) => {
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

app.delete("/links/:id", (req, res) => {
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

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});

//exit events
function save() {
  //console.log("saved file", data);
  fs.writeFileSync(dataPath, JSON.stringify(data));
}

//catches ctrl+c event
process.on("SIGINT", () => {
  save();
  process.exit();
});
// test by using kill [PID_number]
process.on("SIGTERM", () => {
  save();
  server.close(() => {
    console.log("SIGTERM signal received.");
  });
});
