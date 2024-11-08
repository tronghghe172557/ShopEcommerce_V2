const _ = require("lodash");
const { default: mongoose } = require("mongoose");

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

/**
 * Loại bỏ các thuộc tính có giá trị undefined hoặc null khỏi một đối tượng.
 * Nhưng chỉ loại bỏ được 1 cấp, không loại bỏ được nếu có object lồng bên trong.
 * Hàm này sẽ duyệt qua tất cả các key của đối tượng và xóa các thuộc tính nếu giá trị của chúng là null hoặc undefined.
 *
 * @param {Object} obj - Đối tượng cần loại bỏ các thuộc tính undefined hoặc null.
 * @returns {Object} - Đối tượng sau khi đã loại bỏ các thuộc tính có giá trị undefined hoặc null.
 *
 * @example
 * // Ví dụ sử dụng:
 * const originalObject = { name: 'John', age: null, email: undefined, address: '123 Main St' };
 * const cleanedObject = removeUndefinedObject(originalObject);
 * // Kết quả: { name: 'John', address: '123 Main St' }
 *
 * // Sử dụng trong thực tế:
 * const input = { field1: 'value1', field2: null, field3: 'value3' };
 * const result = removeUndefinedObject(input);
 * // result sẽ là { field1: 'value1', field3: 'value3' }
 */
const removeUndefinedObject = obj => {
  Object.keys(obj).forEach( key => {
      if(obj[key] == null) {
          delete obj[key];
      }
  })
  return obj
}

const convertToObjectId = id => new mongoose.Types.ObjectId(id);

module.exports = { getInfoData, getSelectData, getUnSelectData, removeUndefinedObject, convertToObjectId };   
