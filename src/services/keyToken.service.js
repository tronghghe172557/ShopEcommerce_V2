const { default: mongoose } = require("mongoose");
const keytokenModel = require("../models/keyToken.model");
// viết hàm để tạo token
class keyTokenService {
  static createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // LV0
      // save publicKeyString in DB
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey
      // });\

      // LV1
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findKeyStoreByUserId = async(userId) => {
    const id = new mongoose.Types.ObjectId(userId);
    const keyStore =  await keytokenModel.findOne({ user: id }).lean();
    return keyStore;
  } 

  static findByRefreshToken = async(refreshToken) => {
    const keyStore =  await keytokenModel.findOne({ refreshToken: refreshToken }).lean();
    return keyStore;
  } 


  static findByRefreshTokenUsed = async(refreshToken) => {
    const keyStore =  await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    return keyStore;
  } 

  static updateKeyStore = async (userId, newToken, tokenUsed) => {
    console.log("updateKeyStore::", userId, newToken, tokenUsed)
    const filter = { user: userId },
      update = {
        $set: {
          refreshToken: newToken,
          updatedAt: new Date(),
        },
        $addToSet: {
          refreshTokensUsed: tokenUsed, // da duoc su dung de lay token moi
        }
      }

      const keyStore = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        { new: true }
      );

      return keyStore;
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.findByIdAndDelete( id )
  }

  static deleteKeyByUserId = async (userId) => {
    return await keytokenModel.findOneAndDelete( {user: userId } )
  }
}
module.exports = keyTokenService;
