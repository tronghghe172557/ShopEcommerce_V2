const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    email: 1, // 1 mean select
    password: 1, // 0 mean not select
    roles: 1,
    name: 1,
    status: 1,
  },
}) => {
  const shop = await shopModel.findOne({ email }).select(select).lean();
  return shop;
};

module.exports = { findByEmail };
