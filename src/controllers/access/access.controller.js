const AccessService = require("../../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P::signUp]`, req.body);
      /*
        200 OK
        201 Created
    */
      return res.status(200).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error); // Pass errors to the error handler
    }
  };
}

module.exports = new AccessController();
