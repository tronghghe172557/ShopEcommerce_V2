const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandle");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // ACCESS TOKEN
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // xác minh token
    // kiểm tra thời gian hết hạn
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) throw new Error("error verify::", err);
      else {
        // console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1. check userId missing
    2. get accessToken from header
    3. verify accessToken
    4. check token in db
    5. check keyStore with this userId
    6. oke all -> return next()
  */

      const userId = req.headers[HEADER.CLIENT_ID];
});

module.exports = { createTokenPair };
