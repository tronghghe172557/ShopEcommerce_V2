const mongoose = require("mongoose");
const { db: { host, name, port } } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = `mongodb`) {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => console.log(`Connect Mongodb Success Pro`))
      .catch((err) => console.log(`Error Connect!!`));
  }

  static getInstance() {
    if (!Database.instance) {
      // Database.instance: có thể sử dụng khi chưa được khai báo
      // đảm bảo chỉ có một kết nối duy nhất được tạo ra và sử dụng lại trong suốt ứng dụng
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

// ở đây không có 'new' vì:
// 1. getInstance là 1 phương thức tĩnh của class, không phải là contructor
// 2. Phương thức getInstance được gọi trực tiếp từ class Database, không cần tạo ra một đối tượng của Database trước.
// 3. Nếu dùng 'new' => mỗi lần được kết nối sẽ tạo ra 1 đối tượng mới => không hợp lí với mẫu thiết kế Singoleton
const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
