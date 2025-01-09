const redis = require("redis");
const { promisify } = require("util");

// Tạo một client Redis để kết nối đến Redis Server
const redisClient = redis.createClient();

// Tạo các hàm promisify để chuyển hàm callback thành hàm promise
const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

// Hàm acquireLock để lấy khóa phân tán
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retrtTime = 10; // số lần thử lại
  const expireTime = 3000; // 3s

  for (let i = 0; i < retrtTime; i++) {
    // Tạo một key, thằng nào tạo được key đó sẽ được phép thực hiện thanh toán
    const result = await setnxAsync(key, cartId);
    console.log(`result:: ${result}`);
    if (result === 1) {
      // Thao tác với inventory -> kho
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount > 0) {
        await pexpire(key, expireTime);
        return key;
      }
      return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// Hàm releaseLock để giải phóng khóa phân tán
const releaseLock = async (keyLock) => {
  const delAsynKey = promisify(redisClient.del).bind(redisClient);
  return await delAsynKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};