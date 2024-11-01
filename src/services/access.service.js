const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const crypto = require("node:crypto");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {

  static logout = async ({ keyStore }) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    return delKey;
  }

  static login = async ({ email, password, refreshToken = null }) => {
    // step 1: check email exists
    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registered");
    }

    // step 2: check password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error: Password is incorrect");
    }

    // step3: create token
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { _id: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    // step4: save publicKey to DB
    const publicKeyString = await keyTokenService.createToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // logic
    // step1: check email exists
    const holderShop = await shopModel.findOne({ email });
    if (holderShop) {
      throw new BadRequestError("Error: Shop already exists ");
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
        throw new BadRequestError("Error: publicKeyString is not defined ");
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

    throw new BadRequestError("Error: Sign up failed ", 500);
  };
}

module.exports = AccessService;
