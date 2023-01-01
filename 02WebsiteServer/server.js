const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 5000;
const hostname = "127.0.0.1";
/* file types to be supported */
const mimeTypes = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
};

http
  .createServer((req, res) => {
    var myuri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), decodeURIComponent(myuri));
    console.log("File looking for " + filename);
    var loadFile;
    try {
      loadFile = fs.lstatSync(filename);
    } catch (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Page not found");
      res.end();
      return;
    }

    if (loadFile.isFile()) {
      var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
      res.writeHead(200, { "Content-Type": mimeType });
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    } else if (loadFile.isDirectory()) {
      res.writeHead(302, { Location: "index.html" });
      res.end();
    } else {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("500 Internal Server Error");
      res.end();
    }
  })
  .listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
  });
