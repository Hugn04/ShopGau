require('dotenv').config();
const Product = require('../app/Model/Product');
const Cart = require('../app/Model/Cart');
const addProductService = async ({ title, price, description, image }) => {
    let product = await Product.create({
        title: title,
        price: price,
        description: description,
        image: image,
    });
    return product;
};
const deleteProductService = async (slug) => {
    try {
        const product = await Product.findOne({ slug: slug });
        await Cart.deleteMany({ product: product._id });
        await Product.deleteOne({ slug: slug });
    } catch (error) {
        console.error('Lỗi:', error);
    }
};
const updateProductService = async ({ slug, title, price, description, image, amount }) => {
    let product = await Product.findOneAndUpdate(
        { slug: slug },
        {
            title: title,
            price: price,
            description: description,
            image: image,
            amount: amount,
        },
    );
    return product;
};

const buyProductService = async (slug, number) => {
    const product = await Product.findOne({ slug: slug });
    if (product.amount > 0 && product.amount - number >= 0) {
        await Product.updateOne(
            { slug: slug },
            {
                $inc: {
                    amount: -number,
                    sold: number,
                },
            },
        );
    } else {
        throw new Error(`Sản phẩm ${product.title} đã hết hàng vui lòng quay lại sau !`);
    }
};

module.exports = { addProductService, deleteProductService, updateProductService, buyProductService };
