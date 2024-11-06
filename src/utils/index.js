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

/**
 * Tạo một đối tượng projection để chọn các trường trong truy vấn MongoDB.
 * Chuyển đổi một mảng các trường thành một đối tượng với mỗi trường có giá trị là 1.
 *
 * @param {Object} params - Tham số đầu vào.
 * @param {Array<string>} params.fields - Mảng các tên trường cần chọn.
 * @returns {Object} - Đối tượng projection cho truy vấn MongoDB.
 *
 * @example
 * // Ví dụ sử dụng:
 * const selectFields = getSelectData({ fields: ['name', 'email', 'age'] });
 * // Kết quả: { name: 1, email: 1, age: 1 }
 *
 * // Sử dụng trong truy vấn MongoDB với Mongoose:
 * const users = await User.find({}, selectFields);
 * // Truy vấn trên sẽ chỉ trả về các trường 'name', 'email', và 'age' của người dùng.
 */
// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 1]));
};

/**
 * Tạo một đối tượng projection để loại bỏ các trường trong truy vấn MongoDB.
 * Chuyển đổi một mảng các trường thành một đối tượng với mỗi trường có giá trị là 0.
 *
 * @param {Object} params - Tham số đầu vào.
 * @param {Array<string>} params.fields - Mảng các tên trường cần loại bỏ.
 * @returns {Object} - Đối tượng projection cho truy vấn MongoDB để loại bỏ các trường.
 *
 * @example
 * // Ví dụ sử dụng:
 * const unselectFields = getUnSelectData({ fields: ['password', 'email'] });
 * // Kết quả: { password: 0, email: 0 }
 *
 * // Sử dụng trong truy vấn MongoDB với Mongoose:
 * const users = await User.find({}, unselectFields);
 * // Truy vấn trên sẽ trả về tất cả các trường ngoại trừ 'password' và 'email' của người dùng.
 */
const getUnSelectData = ({ fields = [] }) => {
  return Object.fromEntries(fields.map((field) => [field, 0]));
};

module.exports = { getInfoData, getSelectData, getUnSelectData };   
