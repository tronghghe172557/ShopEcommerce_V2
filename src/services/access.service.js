const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // logic
}

module.exports = AccessService;
