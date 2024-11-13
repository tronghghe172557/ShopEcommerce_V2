const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");
const {
  getSelectData,
  getUnSelectData,
  convertToObjectId,
} = require("../../utils");

// GET + FIND //
const findAllDraftProduct = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // ['product_name', 'product_thumb', 'product_price', 'product_quantity', 'product_type', 'product_shop']
    // convert array to object for select
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unselect }) => {
  const productFound = await product
    .findById(product_id)
    .select(getUnSelectData(unselect));

  return productFound;
};

const findProductById = async ({ product_id }) => {
  return await product.findById(convertToObjectId(product_id));
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProductById({
        product_id: product.productId,
      });

      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: foundProduct._id,
        };
      }
    })
  );
};
// END GET + FIND //

// POST //
const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  // cả 2 cách đều dùng được
  // const { modifiedCount } = await product.updateOne({ _id: new Types.ObjectId( product_id ) }, foundShop)
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
// END POST //

// PATCH //
const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  console.log("updateProductById::", productId, bodyUpdate, model);
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};
// END PATCH //

// FUNC QUERY //
const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const updateNestedObjectParse = (obj) => {
  const final = {};
  // thêm  || {}  trong Object.keys để ko bị lỗi -> Cannot convert undefined or null to object
  Object.keys(obj || {}).forEach((k) => {
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      // 'object' viết thường => 'Object'sai
      const response = updateNestedObjectParse(obj[k]);
      // thêm  || {}  trong Object.keys để ko bị lỗi
      Object.keys(response || {}).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};
// FUNC QUERY //

module.exports = {
  findAllDraftProduct,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProduct,
  findProduct,
  updateProductById,
  updateNestedObjectParse,
  findProductById,
  checkProductByServer,
};
