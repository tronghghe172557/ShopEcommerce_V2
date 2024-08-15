const mongoose = require("mongoose"); 
// ở trong node => require thì nó đã catch lại rồi 
// => khó sinh ra hiện tượng mỗi lần export lại có 1 kết nối mới 
// nhưng ở trong ngôn ngữ khác thì không như thế
// => Giải pháp: dùng các thiết kết: Singoleton

const connectString = `mongodb://localhost:27017/ShopDEV2`;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connect Mongodb Success`))
  .catch((err) => console.log(`Error Connect!!`));

if (1 == 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose
