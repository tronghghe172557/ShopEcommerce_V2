const AccessService = require("../../services/access.service");
const { Created, SuccessResponse } = require("../../core/success.response");

class AccessController {

  handleRefreshToken = async (req, res, next) => {
 
    // v1
    // new SuccessResponse({
    //   message: "handleRefreshToken successfully",
    //   metadata: await AccessService.handleRefreshToken( req.body ),
    // }).send(res);

    // v2 fixed, no need accessToken
    new SuccessResponse({
      message: "handleRefreshToken successfully",
      metadata: await AccessService.handleRefreshTokenV2( {
        // give from authenticationV2
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      } ),
    }).send(res);
  };
  
  logout = async (req, res, next) => {
    //
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  login = async (req, res, next) => {
    //
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    //
    new Created({
      message: "Created successfully",
      metadata: await AccessService.signUp(req.body),
      options: { limit: 20 },
    }).send(res);
  };
}

module.exports = new AccessController();
