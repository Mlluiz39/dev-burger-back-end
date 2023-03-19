const express = require("express");
const routes = require("./routes");
const resolve = require("path").resolve;
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

require("./database");

class App {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.middleware();
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
