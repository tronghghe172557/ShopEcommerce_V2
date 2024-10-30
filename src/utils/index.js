const _ = require("lodash");

/**
 * Lấy các trường cụ thể từ một đối tượng.
 * @param {Object} params - Tham số đầu vào.
 * @param {Array} params.fields - Các trường cần lấy.
 * @param {Object} params.object - Đối tượng nguồn.
 * @returns {Object} - Đối tượng mới chỉ chứa các trường được chỉ định.
 */
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = { getInfoData };   
