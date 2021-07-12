import app from "./app";

const http = require("http");
const port = process.env.EXPRESS_PORT || 3000;

http
  .createServer(app)
  .listen(port, () => {
    console.log(`HTTP server is running at ${port}`);
  })
  .on("error", (err) => {
    console.error(err);
  });
