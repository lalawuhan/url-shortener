const polka = require("polka");
const app = polka({
  onError: (err, req, res) => {
    const code = (res.statusCode = err.code || err.status || 500);
    if (code === 500 && process.env.NODE_ENV === "production") {
      res.end(http.STATUS_CODES[code]);
      return;
    }
    res.end(err.length && (err || err.message || http.STATUS_CODES[code]));
  },
});

const port = 3000;
const generateID = require("./generateNum.js");
const fs = require("fs");

const dataPath = "./data/links.json";

//TODO: make it more robust, move json to new file and use fs.read/write file
//note: during the post I noticed that the data overwrites all the existing data, solution is to read the current file, and
//push the new data to that array// append json data did not keep the structure I wanted.
//TODO: do the put and delete next using the write file methods
// let fakeDb = [
//   {
//     id: 1,
//     url: "http://google.com",
//   },
//   {
//     id: 2,
//     url: "http://facebook.com",
//   },
//   {
//     id: 3,
//     url: "http://twitter.com",
//   },
//   {
//     id: 4,
//     url: "http://reddit.com",
//   },
//   {
//     id: 5,
//     url: "http://youtube.com",
//   },
// ];

let data;
try {
  data = JSON.parse(fs.readFileSync("data/links.json"));
} catch (err) {
  if (err.code === "ENOENT") {
    const err = new Error("File does not exist.");
    err.status = 404;
    throw err;
  } else {
    const err = new Error();
    throw err;
  }
}

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    res.statusCode = 200;
    res.end("Homepage");
  } catch (err) {
    console.error(err);
  }
});

app.get("/links", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
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
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let newLink = {
        id: generateID(data),
        url: JSON.parse(body),
      };
      data.push(newLink);
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          status: res.statusCode,
          message: `Link successfully added`,
        })
      );
    });
  } catch (err) {
    console.error(err);
  }
});

app.put("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  if (link) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let linkUpdate = JSON.parse(body);
      let prevLink = link.url;
      let newLink = linkUpdate.url;
      link.url = newLink;
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          status: res.statusCode,
          message: `Link successfully updated`,
          prevLink: prevLink,
          newLink: newLink,
        })
      );
    });
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
    data = data.filter((link) => link.id != req.params.id);
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: `Deleted successsfully`,
      })
    );
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
