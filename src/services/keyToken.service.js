const keytokenModel = require('../models/keyToken.model');
// viết hàm để tạo token
class keyTokenService {
  static createToken = async ({ userId, publicKey, privateKey }) => {
    try {
      
      // save publicKeyString in DB
      const token = await keytokenModel.create({
        user: userId,
        publicKey: publicKey,
        privateKey
      });

      // new keytokenModel({
      //     user: userId,
      //     publicKey: publicKeyString,
      // })

      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = keyTokenService;
