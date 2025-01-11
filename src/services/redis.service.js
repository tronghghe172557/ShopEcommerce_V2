const { createClient } = require("redis");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

// Tạo một client Redis
const redisClient = createClient();

/*
  1. Sử dụng khoá phân tán để khoá sản phẩm khi có nhiều người thực hiện order cùng 1 sản phẩm cùng 1 thời điểm
  2. Sử dụng premistic (khoá bi quan) để khoá sản phẩm
  3. Sử dụng redis để lưu khoá phân tán và giải phóng khoá (khi thực hiện xong mục đích)
*/

// Các hàm để thực hiện hành động trên Redis
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10; // số lần thử lại
  const expireTime = 3; // 3s

  for (let i = 0; i < retryTime; i++) {
    // Tạo một key, thằng nào tạo được key đó sẽ được phép thực hiện thanh toán
    const result = await redisClient.set(key, {
      NX: true, // nx = not exist
      EX: expireTime, // ex = expire
    }); // Sử dụng set với tùy chọn NX và EX
    console.log(`result:: ${result}`);
    if (result) { 
      /*
        Nếu lấy được khoá -> thực hiện hành động
        Thực hiện các hành động với kho
      */
      // Thao tác với inventory -> kho
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReservation.modifiedCount > 0) {  // modifiedCount > 0 update thành công
        // Đặt thời gian hết hạn cho khóa -> đảm bảo không bị chết khóa
        await redisClient.expire(key, expireTime); 
        return key;
      }
      return null;
    } else { 
      /*
        nếu không lấy được khoá
        TH1: 
          Khoá được được 1 người sử dụng -> chờ hệ thống xử lí xong hành động và giải phóng khoá       
        TH2:
          Khoá bị hết hạn -> thử lại
      */
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
