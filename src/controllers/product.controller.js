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

    /**
     * @description Publish a product owned by the shop
     * @route       PUT /api/products/publish/:id
     * @access      Private (Shop owners only)
     * @returns     {JSON} - JSON response indicating the product has been published
     * @example
     * // To publish a product:
     * // Endpoint: PUT /api/products/publish/:id
     * // Headers:
     * //   Authorization: Bearer <token>
     * // Path Parameters:
     * //   id - The ID of the product to publish
     * // Response:
     * //   {
     * //     "message": "Publish product success in ProductController",
     * //     "metadata": { ... } // Details of the published product
     * //   }
     */
    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success in ProductController',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user._id,
                product_id: req.params.id,
            }),
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

     /**
     * @description Get all published products for the shop
     * @param {Number} limit - (Optional) Maximum number of products to return
     * @param {Number} skip - (Optional) Number of products to skip
     * @param {import('mongoose').ObjectId} product_shop - Shop ID (extracted from authenticated user)
     * @returns {JSON} - JSON response containing the list of published products
     * @example
     * // To fetch published products:
     * GET /api/product/published?limit=10&skip=0
     * Headers: { Authorization: Bearer <token> }
     */
    getAllPublishProduct = async(req, res, next) => { 
        new SuccessResponse({
            message: 'Get list publish product success in ProductController',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user._id,
            }),
        }).send(res)
    }
    // END QUERY //

}
module.exports = new ProductController(); // trả về các method của obj đó