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

app.get("/", (req, res) => {
  fs.readFile(homePage, { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      console.log("received data: " + data);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    } else {
      console.log(err);
    }
  });
});

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

app.get("/links", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(renderList(data));
});

app.get("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    res.writeHead(301, {
      Location: `${link.url}`,
    });
    res.end();
  } else {
    const err = new Error("Link not found");
    err.status = 404;
    res.end(
      JSON.stringify({
        status: err.status,
        message: err.message,
      })
    );
  }
});

app.post("/links", (req, res) => {
  console.log("headers", req.headers);
  console.log("content", req.headers["content-type"]);
  if (req.headers["content-length"] === "0") {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "Data is empty",
      })
    );
  }
  if (req.headers["content-type"] === "application/json") {
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
  res.setHeader("Content-Type", "application/json");
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    let body = req.body;
    let newLink = body.url;
    let prevLink = link.url;
    link.url = newLink;
    res.statusCode = 200;
    res.write(`<p>${prevLink} successfully updated to ${newLink}.</p>`);
    res.write(renderList(data));
    res.end();
  } else {
    const err = new Error("Cannot update link");
    err.status = 404;
    res.end(
      JSON.stringify({
        status: err.status,
        message: err.message,
      })
    );
  }
});

app.delete("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    let linkData = link;
    console.log("linkData", linkData);
    data = data.filter((link) => link.id != req.params.id);
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.write(
      `<p> ${linkData.url} with id: ${linkData.id} deleted successfully.</p>`
    );
    res.write(renderList(data));
    res.end();
  } else {
    const err = new Error("Cannot delete link");
    err.status = 404;
    res.end(
      JSON.stringify({
        status: err.status,
        message: err.message,
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
