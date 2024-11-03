// const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    // createProduct = async(req, res, next) => {
    //     new SuccessResponse({
    //         message: 'Create product success in ProductController',
    //         metadata: await ProductService.createProduct(
    //             req.body.product_type,
    //             {
    //                 ...req.body,
    //                 product_shop: req.user._id,
    //             }
    //         ),
    // }).send(res)
    // }

    createProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create product success in ProductController',
            metadata: await ProductServiceV2.createProduct(
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