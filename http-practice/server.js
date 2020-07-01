const polka = require("polka");
const app = polka();
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
    console.log("File not found!");
  } else {
    throw err;
  }
}

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.end("Homepage");
});

app.get("/links", (req, res) => {
  res.end(JSON.stringify(data));
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
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        error: "Link does not exist",
      })
    );
  }
});

app.post("/links", (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      console.log("JSON DATA:", body);
      let newLink = {
        id: generateID(),
        url: JSON.parse(body),
      };
      data.push(newLink);

      console.log("Done writing", data); // Success

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: ` Link successfully added: ${newLink.url} added with id of ${newLink.id}`,
        })
      );
    });
  });
});

app.put("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("data found", data);
  const id = req.params.id;
  let link = data.find((link) => link.id === id);
  console.log("link found", link);
  if (link) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let linkUpdate = JSON.parse(body);
      let prevLink = link.url;
      link.url = linkUpdate.url;
      res.end(
        JSON.stringify({
          status: "Link was updated",
          message: `${prevLink} was updated. It is now ${linkUpdate.url}`,
        })
      );
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Cannot update link" }));
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
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Cannot delete link." }));
  }
});
app.use((err, req, res, next) => {
  // Sets HTTP status code or default to server error
  res.status(err.status || 500);
  // Sends response
  res.json({
    status: err.status,
    message: err.message,
    //stack: err.stack,
  });
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
