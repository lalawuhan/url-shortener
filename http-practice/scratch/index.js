const http = require("http");
const port = 8080;
// const urlPattern = "//link/([^/]*)$/";
const urlPattern = /^\/links\/(\w+)\/?$/;
//TODO: regex pattern help this will match /one/one instead of just /one
let urlLinks = {
  1: "http://google.com",
  2: "http://facebook.com",
  3: "http://twitter.com",
  4: "http://reddit.com",
  5: "http://youtube.com",
};
//TODO: match the request url
//TODO: matching specifically on the url
//TODO: check what happens after link, then work bacwards to find the match
//TODO: crop the url to avoid the / inside and use that word as a search term
//TODO: post method has an additional headers/set issue
//TODO: read an intro to curl, most important things to know

// const searchTerm = urlLinks["one"];
// console.log("searchTerm ", searchTerm);
// const test = searchTerm.match(urlPattern);
// console.log(test);

// console.log("is this matching", test);

const requestHandler = (req, res) => {
  console.log(`method is ${req.method} and url is ${req.url}`);
  const reqUrl = req.url;
  if (reqUrl === "/") {
    console.log("homepage");
    res.end("Home page");
  } else {
    const match = reqUrl.match(urlPattern);
    console.log("match", match);
    if (match === null) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    const [, id] = match;

    let urlMatch = urlLinks[`${id}`];
    console.log("original url match", urlMatch);
    if (req.method === "GET") {
      if (urlMatch === undefined) {
        res.statusCode = 404;
        res.end();
      }
      // res.setHeader("Content-Type", "text/plain");
      res.writeHead(301, {
        Location: `${urlMatch}`,
      });
      res.end();
    } else if (req.method === "POST") {
      let body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
        // body += chunk.toString(); // convert Buffer to string
        //how to use the id, and add this to the databse?
        //change urlMatch?  urlMatch = body;
      });
      req.on("end", () => {
        body = Buffer.concat(body).toString();
        console.log("body", body);
        res.end("ok");
      });
    } else if (req.method === "PUT") {
      if (urlMatch === undefined) {
        res.statusCode = 404;
        res.end();
      } else {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
          // res.writeHead(301, {
          //   Location: `${body}`,
          // });
        });
        req.on("end", () => {
          console.log("body", body);
          res.end("ok");
        });
      }
    } else {
      console.log(req.url);
      console.log("request:", req.method);
      res.end("End of function!");
    }
  }
};
// curl -X PUT -H "Content-Type: application/json" -d "https://www.keycdn.com/support/put-vs-post" localhost:8080
// curl -X GET http://localhost:8080/
// curl -X GET http://localhost:8080/one
const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
