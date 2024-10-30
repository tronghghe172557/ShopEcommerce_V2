const JWT = require("jsonwebtoken");

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
    console.log(error)
  }
};

module.exports = { createTokenPair };
