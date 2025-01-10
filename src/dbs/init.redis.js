const { createClient } = require("redis");

class RedisConnection {
  constructor() {
    if (RedisConnection.instance) {
      return RedisConnection.instance; // Nếu đã có instance thì trả về instance đó
    }

    this.redisClient = createClient();

    // Lắng nghe lỗi từ Redis
    this.redisClient.on("error", (err) => {
      console.error("Lỗi Redis Client:", err);
    });

    // Kết nối Redis
    this.redisClient
      .connect()
      .then(() => console.log("Kết nối Redis thành công!"))
      .catch((err) => console.error("Kết nối Redis thất bại:", err));

    // Lưu instance để dùng lại
    RedisConnection.instance = this;
  }

  // Phương thức lấy client Redis
  static getInstance() {
    if (!RedisConnection.instance) {
      new RedisConnection(); // Tạo instance nếu chưa có
    }
    return RedisConnection.instance;
  }

  getClient() {
    return this.redisClient; // Trả về instance Redis Client
  }

  // Đóng kết nối Redis
  async disconnect() {
    if (this.redisClient) {
      await this.redisClient.quit();
      console.log("Đã đóng kết nối Redis.");
    }
  }
}

// Xuất ra instance của Singleton
module.exports = RedisConnection.getInstance();
