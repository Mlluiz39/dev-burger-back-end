const Sequelize = require("sequelize");
const mongoose = require("mongoose");

// const configDatabase = require("../config/database");
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
    this.connection = new Sequelize(
      "postgres://devburger_user:i34WUiAtRQz1MSPrZAKD8GQpjvN8uf5b@dpg-cgqsq2e4dadbdtff911g-a/devburger"
    );

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    mongoose.set("strictQuery", true);
    this.mongoConnection = mongoose.connect(
      "mongodb+srv://mlluiz39:Julia2912@cluster0.df9gz.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
}

module.exports = new Database();
