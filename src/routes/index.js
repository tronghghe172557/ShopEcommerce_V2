const express = require("express");
const router = express.Router();

router.use('/v1/api', require('./access'));
// router.use("/", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome my web",
//   });
// });

module.exports = router;
