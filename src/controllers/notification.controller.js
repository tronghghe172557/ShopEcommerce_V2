const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
  getNotificationByUserId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get notification success in getNotificationByUserId service",
      metadata: await listNotiByUser({
        userId: req.body.userId,
        type: req.body.type,
        isRead: req.body.isRead,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController(); // trả về các method của obj đó
