const polka = require("polka");
const app = polka();
const port = 3000;

//TODO: add status codes to let the user know the action has happened
//TODO: delete unneccessary comments

let fakeDb = [
  {
    id: 1,
    url: "http://google.com",
  },
  {
    id: 2,
    url: "http://facebook.com",
  },
  {
    id: 3,
    url: "http://twitter.com",
  },
  {
    id: 4,
    url: "http://reddit.com",
  },
  {
    id: 5,
    url: "http://youtube.com",
  },
];

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.end("Homepage");
});

app.get("/links", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let body = fakeDb;
  //TODO: do not need the event listeners : read the notes again, do not need the body variable
  //res.write(JSON.stringify(body));
  res.end(JSON.stringify(body)); // can add the entire write function inside res.end
  // req.on("data", (chunk) => {
  //   body += chunk.toString();
  // });
  // req.on("end", () => {
  //   res.write(JSON.stringify(body));
  //   res.end();
  // });
});

app.get("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json"); // be consistent with the responses
  const id = parseInt(req.params.id);
  let link = fakeDb.find((link) => link.id === id);
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
  res.setHeader("Content-Type", "application/json");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let newLink = JSON.parse(body); //error handling can be done to check the body
    newLink.id = 6;
    console.log("new link data", newLink);
    fakeDb.push(newLink);
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error: "Link successfully added",
      })
    ); //TODO: send back the link you made, with id as JSON
  });
  //   res.statusCode = 404;
  //   res.end("Error: cannot add link");
});
//length of key, how many keys can you have, does it need a central database, pros and cons
//generating links
app.put("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let id = parseInt(req.params.id);
  let link = fakeDb.find((link) => link.id === id);
  if (link) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let linkUpdate = JSON.parse(body);
      link.url = linkUpdate.url;
      res.end(JSON.stringify({ status: "Link was updated" }));
    });
  } else {
    res.statusCode = 404;
    res.end("Error: cannot update link");
  }
});

app.delete("/links/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let matchingID = fakeDb.find((link) => link.id === parseInt(req.params.id));
  if (matchingID) {
    ///TODO: how to improve delete functionality
    delete matchingID.url;
    delete matchingID.id;
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "Deleted successsfully" }));
  } else {
    res.statusCode = 404;
    res.end("Error: cannot delete link.");
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});
