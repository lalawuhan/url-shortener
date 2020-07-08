const fs = require("fs");
const polka = require("polka");
const bodyParser = require("body-parser");
const home = require("./routes/home");
const links = require("./routes/links");
let { data } = require("./data/data");

const port = 3000;
const dataPath = "./data/links.json";

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
// app.use("/api", links);

app.get("/", home);

app.get("/links", home);

app.get("/links/:id", links.read);

app.post("/links", links.create);

app.put("/links/:id", links.update);
app.post("/links/put/:id", links.update); // for form

app.delete("/links/:id", links.delete);
app.post("/links/delete/:id", links.delete);  // for form

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});

//exit events
function saveFile() {
  console.log("data successfully saveFiled");

  fs.writeFileSync(dataPath, JSON.stringify(data));
}

//catches ctrl+c event
process.on("SIGINT", () => {
  saveFile();
  process.exit();
});
// test by using kill [PID_number]
process.on("SIGTERM", () => {
  saveFile();
  server.close(() => {
    console.log("SIGTERM signal received.");
  });
});
