const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')
const { product } = require('../models/product.model')
class ProductController {
    createProduct = async(req, res, next) => {
        console.log(req.user)
        new SuccessResponse({
            message: 'Create product success in ProductController',
            metadata: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user._id,
                }
            ),
    }).send(res)
    }
}
module.exports = new ProductController(); // trả về các method của obj đó