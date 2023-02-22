const express = require("express");
const routes = require("./routes");
const resolve = require("path").resolve;

require("./database");

class App {
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());

    this.app.use(
      "/product-files",
      express.static(resolve(__dirname, "..", "uploads"))
    );

    this.app.use(
      "/category-files",
      express.static(resolve(__dirname, "..", "uploads"))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

module.exports = new App().app;
