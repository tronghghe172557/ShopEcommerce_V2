const AccessService = require("../../services/access.service");
const { Created, SuccessResponse } = require("../../core/success.response");

class AccessController {
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
