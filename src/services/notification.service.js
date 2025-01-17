const notificationModel = require("../models/notification.model");

const pushNotification = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  noti_options = {},
}) => {
  let noti_content = "";

  if (type === "ORDER-001") {
    noti_content = "Order successfully";
  } else if (type === "SHOP-001") {
    noti_content = "New product by User following";
  }

  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_content,
    noti_options,
  });
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = {
    noti_receivedId: userId,
  };
  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await notificationModel.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_content: 1,
        noti_options: 1,
        createAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotification,
  listNotiByUser,
};
