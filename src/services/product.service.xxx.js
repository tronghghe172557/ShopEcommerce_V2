const { product, clothing, electronic, furniture } = require("../models/product.model");
const { BadRequestError } = require('../core/error.response');
const { findAllDraftProduct, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductsByUser, findAllProduct, findProduct, updateProductById, updateNestedObjectParse } = require("../models/repositories/product.repo");
const { removeUndefinedObject } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { pushNotification } = require("./notification.service");

// define Factory class to create product
class ProductFactory {
    /* 
        type: "",
        payload
    */

    static productRegistry = {
        // key -> clothing
        // value -> Clothing -> 
    } // key - value: value is CLASS

    // register when new CLASS is created
    static registerProductType(type, classRef) {
        //                             key     class
        ProductFactory.productRegistry[type] = classRef
    }
    
    //
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if(!productClass) throw new BadRequestError(`Invalid Product Types: ${type} in ProductFactory`)
        
        // productClass(payload) ->Ex: new Clothing(payload)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]

        if(!productClass) throw new BadRequestError(`Invalid Product Types: ${type} in updateProduct in ProductFactory`)
        
        // productClass(payload) ->Ex: new Clothing(payload)
        return new productClass(payload).updateProduct(productId) // this -> payload
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    // END PUT //

     // QUERY //
    static async findAllDraftProduct( {product_shop, limit, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftProduct({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProductsByUser ({ keySearch }) {
        return searchProductsByUser({ keySearch })
    }

    // ctime => the newest
    static async findAllProduct ({ limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return findAllProduct({ limit, sort, page, filter, 
            select: ['product_name', 'product_thumb', 'product_price', 'product_quantity', 'product_type', 'product_shop']
        })
    }

    static async findProduct ({ product_id }) {
        return findProduct({ product_id, unselect: ['__v'] })
    }
     // END QUERY //

}

// define base product class
class Product {
    // trong contructor: dùng dấu ;
    constructor({
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct( product_id ) {
        const newProduct =  await product.create({ ...this, _id: product_id}) // this: instance (ví dụ) of Product
        if(newProduct) {
            // add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        // push noti to system collection -> notify to user
        // dùng cơ chế bất đồng bộ để làm -> sau đó sẽ dùng message and queue để xử lý -> h thì chưa
        pushNotification({
            type: 'SHOP-001',
            receivedId: 1, // cho la 1 boi vi chua co user trong model
            senderId: this.product_shop,
            noti_options: { 
                productName: this.product_name,
                shop_name: this.product_shop
            }
        }).then(res => console.log(`Push notification success: ${res} in product.service.js`))
        .catch(err => console.log(`Push notification error: ${err}  in product.service.js`))
        return newProduct
    }

    // update product
    async updateProduct( productId, bodyUpdate ) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    // @override
    async createProduct() {
        // create attribute first
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }) // this: is Product instance (ví dụ)
        if(!newClothing) throw new BadRequestError('Create new Clothing error in product.service.js')
        // create product include newClothing
        const newProduct = await super.createProduct(newClothing._id) // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error in product.service.js')
        return newProduct;
    }

    // @override
    async updateProduct( productId ) {
        // 1. Remove fields that are null or undefined
        const objectParams = removeUndefinedObject(this)
        // 2. check update product or update additional attribute
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
                model: clothing
            })
        }
        // 3.
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    
        return updateProduct
    }
}

// Define sub-class for different product types Electronics
class Electronic extends Product {
    // @override
    async createProduct() {
        // create attribute first
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }) // this: is Product instance
        if(!newElectronic) throw new BadRequestError('Create new Electronics error in product.service.js')
        // create product include newElectronic 
        const newProduct = await super.createProduct(newElectronic._id) // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error in product.service.js')
        return newProduct;
    }

    // @override
    async updateProduct( productId ) {
        // 1. Remove fields that are null or undefined
        const objectParams = removeUndefinedObject(this)
        // 2. check update product or update additional attribute
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
                model: electronic
            })
        }
        // 3.
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    
        return updateProduct
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
    // @override
    async createProduct() {furniture
        // create attribute first
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        }) // this: is Product instance
        if(!newFurniture) throw new BadRequestError('Create new Furniture error in product.service.js')
        // create product include newFurniture 
        const newProduct = await super.createProduct(newFurniture._id) // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error in product.service.js')
        return newProduct;
    }

    // @override
    async updateProduct( productId ) {
        // 1. Remove fields that are null or undefined -> level 1
        const objectParams = removeUndefinedObject(this)

        // 2. check update product or update additional attribute
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, 
                // -> level 2: Remove fields that are null or undefined in CHILD
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), 
                model: furniture })
        }
        // 3. Update Parent
        // -> level 2: Remove fields that are null or undefined in CHILD
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
    
        return updateProduct
    }
}

// register product type
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)


// export nó như 1 class chứ ko được export như 1 đối tượng
// class => mới dùng được hàm tĩnh
module.exports = ProductFactory
