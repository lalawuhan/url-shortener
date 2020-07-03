const polka = require("polka");
const fs = require("fs");
const links = require("./routes/links");
const bodyParser = require("body-parser");
const port = 3000;
const dataPath = "./data/links.json";
let { data } = require("./data/data");

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
app.use("/api", links);

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
