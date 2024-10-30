const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const crypto = require("node:crypto");
const { getInfoData } = require("../utils");

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
        // lỗi ko đúng tên trường
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // 1 chuỗi dài 64 bit => của thằng nodejs
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // step5: save publicKey to DB
        const publicKeyString = await keyTokenService.createToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!publicKeyString) {
          return {
            code: "XXX",
            message: "publicKeyString error",
            status: 500,
          };
        }

        // step6: create token pair
        const tokens = await createTokenPair(
          { _id: newShop._id, email: newShop.email },
          publicKey,
          privateKey
        );

        return {
          code: "201",
          message: "Sign up successfully",
          status: 200,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens: tokens,
          },
        };
      }

      return {
        code: "XXX",
        message: "Sign up failed",
        status: 500,
      };
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
