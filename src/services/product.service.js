const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require('../core/error.response')

// define Factory class to create product
class ProductFactory {
    /* 
        type: "",
        payload
    */
    static async createProduct(type, payload) {
        switch( type ) {
            case 'Electronics':
                return await new Electronic(payload).createProduct();
            case 'Clothing':
                return await new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid Product Types: ${type} in ProductFactory`) 
        }
    }
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

    async createProduct() {
        return await product.create(this) // this: instance (ví dụ) of Product
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    // @override
    async createProduct() {
        // create attribute first
        const newClothing = await clothing.create(this.product_attributes) // this: is Product instance (ví dụ)
        if(!newClothing) throw new BadRequestError('Create new Clothing error in product.service.js')
        // create product include newClothing
        const newProduct = await super.createProduct() // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error in product.service.js')
        return newProduct;
    }
}

// Define sub-class for different product types Electronics
class Electronic extends Product {
    // @override
    async createProduct() {
        // create attribute first
        const newElectronic = await electronic.create(this.product_attributes) // this: is Product instance
        if(!newElectronic) throw new BadRequestError('Create new Electronics error in product.service.js')
        // create product include newElectronic 
        const newProduct = await super.createProduct() // chính là thằng Product
        if(!newProduct) throw new BadRequestError('Create new Product error in product.service.js')
        return newProduct;
    }
}

// export nó như 1 class chứ ko được export như 1 đối tượng
// class => mới dùng được hàm tĩnh
module.exports = ProductFactory
