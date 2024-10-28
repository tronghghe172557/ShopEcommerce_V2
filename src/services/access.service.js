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
    try {
      // step1: check email exists
      const holderShop = await shopModel.findOne({ email });
      if (holderShop) {
        return {
          code: "XXX",
          message: "Email already exists",
          status: 400,
        };
      }

      // step2: create new shop
      const passwordHash = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
      const newShop = await shopModel.create({
        name,
        email,
        passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create new privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey });
      }
    } catch (error) {
      return {
        code: "XXX",
        message: "Error message",
        status: 500,
      };
    }
  };
}

module.exports = AccessService;
