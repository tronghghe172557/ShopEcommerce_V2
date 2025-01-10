const { createClient } = require("redis");
const { reservationInventory } = require("../models/repositories/inventory.repo");

// Tạo một client Redis
const redisClient = createClient();

// Các hàm để thực hiện hành động trên Redis
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10; // số lần thử lại
  const expireTime = 3; // 3s

  for (let i = 0; i < retryTime; i++) {
    // Tạo một key, thằng nào tạo được key đó sẽ được phép thực hiện thanh toán
    const result = await redisClient.setNX(key, cartId); // Sử dụng setNX với API mới
    console.log(`result:: ${result}`);
    if (result) {
      // Thao tác với inventory -> kho
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount > 0) {
        await redisClient.expire(key, expireTime); // Đặt thời gian hết hạn cho khóa
        return key;
      }
      return null;
    } else {
      // Đợi 50ms trước khi thử lại
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// Hàm releaseLock để giải phóng khóa phân tán
const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
