const polka = require("polka");
const app = polka();
const port = 3000;
const generateID = require("./generateNum.js");
const fs = require("fs");
const dataPath = "data/links.json";

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

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.end("Homepage");
});

app.get("/links", (req, res) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) {
      throw err;
    }
    res.end(JSON.stringify(JSON.parse(data)));
  });
});

app.get("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  fs.readFile(dataPath, (err, data) => {
    if (err) {
      throw err;
    }
    let parsedData = JSON.parse(data);
    const id = req.params.id;
    let link = parsedData.find((link) => link.id === id);
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
});

app.post("/links", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  fs.readFile(dataPath, function (err, data) {
    let jsonData = JSON.parse(data);
    let newLink = {
      id: generateID(),
      url: JSON.parse(body),
    };
    jsonData.push(newLink);
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      console.log("Done writing"); // Success
    });
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: ` Link successfully added: ${newLink.url} added with id of ${newLink.id}`,
      })
    );
  });
});

app.put("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = req.params.id;
  let link = fakeDb.find((link) => link.id === id);
  if (link) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let linkUpdate = JSON.parse(body);
      link.url = linkUpdate.url;
      res.end(
        JSON.stringify({
          status: "Link was updated",
          message: `${link.url} updated. It is now ${linkUpdate.url}`,
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
  let link = fakeDb.find((link) => link.id === id);
  if (link) {
    ///TODO: how to improve delete functionality
    delete link.url;
    delete link.id;
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

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});
