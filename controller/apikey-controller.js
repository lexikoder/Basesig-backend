const SubscriptionApikey = require("../models/subscription-apikeys");
const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/appError");
const { decrypt } = require("../utils/encrypt");

const decryptApikey = tryCatch(async (req, res, next) => {
  const { userId } = req.params;

  const subapikey = await SubscriptionApikey.findOne({ user: userId });

  if (!subapikey) {
    throw new AppError("data not found", 404);
  }

  const apikey = decrypt(subapikey.apikey);

  return res
    .status(200)
    .json({
      success: true,
      message: "apikey decrypted",
      data: { apikey: apikey },
    });
});

module.exports = {
  decryptApikey,
};
