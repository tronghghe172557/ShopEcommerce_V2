const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandle");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findKeyStoreByUserId } = require("../services/keyToken.service");

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

  // 1.
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new AuthFailureError("Not found userId in authentication");
  }

  // 2.
  const keyStore = await findKeyStoreByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Invalid keyStore in authentication");
  }

  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!keyStore) {
    throw new NotFoundError("Invalid request in authentication");
  }

  // 4.
  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId != decodeUser._id) {
      throw new AuthFailureError(
        "UserId is not similar decodeUser in authentication"
      );
    }

    // 5.
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log("in authentication error::", error);
    throw `authentication::${error}`;
  }
});

const verifyToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyToken };
