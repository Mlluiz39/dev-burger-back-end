const Sequelize = require("sequelize");
const mongoose = require("mongoose");

const configDatabase = require("../config/database");
const User = require("../app/models/User");
const Product = require("../app/models/Product");
const Category = require("../app/models/Category");

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://164.152.48.202/devBurger",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    mongoose.set("strictQuery", false);
  }
}

module.exports = new Database();
