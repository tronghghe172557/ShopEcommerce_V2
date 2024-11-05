// const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { SuccessResponse } = require('../core/success.response')

class ProductController {

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

    // QUERY //
    /**
     * @description Get all draft product for shop
     * @param {Number} limit
     * @param {Number} ship
     * @param {import('mongoose').ObjectId} product_shop 
     * @returns { JSON }
     */
    getAllDraftProduct = async(req, res, next) => { 
        new SuccessResponse({
            message: 'Get list product success in ProductController',
            metadata: await ProductServiceV2.findAllDraftProduct({
                product_shop: req.user._id,
            }),
        }).send(res)
    }
    // END QUERY //

}
module.exports = new ProductController(); // trả về các method của obj đó