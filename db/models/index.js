"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// RELATIONSHIPS
db.Author.hasMany(db.Book, {
  as: "books",
  foreignKey: { fieldName: "authorId", allowNull: true },
});
db.Book.belongsTo(db.Author, {
  as: "author",
  foreignKey: { fieldName: "authorId" },
});

db.User.hasOne(db.Author, {
  as: "author",
  foreignKey: "userId",
});
db.Author.belongsTo(db.User, { as: "user" });

// User ----> Order
db.User.hasMany(db.Order, { as: "orders", foreignKey: "userId" });
db.Order.belongsTo(db.User, { as: "user" });

// Order <---> Order Item
db.Order.belongsToMany(db.Book, {
  through: db.OrderItem,
  foreignKey: "orderId",
  as: "books",
});
db.Book.belongsToMany(db.Order, {
  through: db.OrderItem,
});
// Export
module.exports = db;
