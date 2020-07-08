module.exports = function accepts(req) {
  if (req.headers.accept.indexOf("application/json") !== -1) {
    return "json";
  } else {
    return "html";
  }
}
