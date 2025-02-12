const { buyProductService } = require('../../services/ProductService');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');
const Cart = require('../Model/Cart');
const Product = require('../Model/Product');

class ProductController {
    async index(req, res) {
        try {
            const slug = req.params.slug;
            const { type, sort } = req.query; // Lấy tham số từ query

            // Tạo bộ lọc và sắp xếp
            let filter = {};
            let sortOrder = {};

            // Lọc theo type nếu có
            if (type) {
                if (type === 'price') {
                    filter.price = { $exists: true };
                } else if (type === 'speed') {
                    filter.sold = { $exists: true };
                } else if (type === 'name') {
                    filter.title = { $exists: true };
                }
            }

            // Sắp xếp theo sort nếu có
            if (sort) {
                const order = sort === 'asc' ? 1 : -1;
                if (type === 'price') {
                    sortOrder.price = order;
                } else if (type === 'speed') {
                    sortOrder.sold = order;
                } else if (type === 'name') {
                    sortOrder.title = order;
                }
            }

            // Lấy danh sách sản phẩm theo bộ lọc và sắp xếp
            const products = await Product.find(filter).sort(sortOrder);

            // Lấy lỗi từ session nếu có
            const error = req.session.error;
            req.session.error = null;

            // Render ra view
            res.render('product', {
                error: error,
                product: multipleMongooseToObject(products),
                slug: slug,
            });
        } catch (error) {
            console.log(error);

            // Render lại trang với lỗi
            res.render('product', { error });
        }
    }

    async addToCart(req, res) {
        const { amount, proID, userID } = req.body;
        const slug = req.params.slug;
        try {
            await Cart.create({ user: userID, product: proID, amount });
            req.session.error = 'Thêm sản phẩm thành công';
            res.redirect(`/product/${slug}`);
        } catch (error) {
            console.log(error);

            res.redirect('/');
        }
    }
    async cart(req, res) {
        const error = req.session.error;
        req.session.error = null;

        try {
            const cart = await Cart.find({ user: res.locals.user.id }).populate(
                'product',
                'title image price seller slug',
            );

            res.render('cart', { cart: multipleMongooseToObject(cart), error });
        } catch (error) {}
    }
    async buy(req, res) {
        const slug = req.params.slug;
        try {
            await buyProductService(slug, req.body.amount);
            req.session.error = 'Bạn đã mua sản phẩm thành công !';
            res.redirect(`/${slug}`);
        } catch (error) {
            req.session.error = error.message;
            res.redirect(`/${slug}`);
        }
    }

    async buyFromCart(req, res) {
        const { amounts, slugs } = req.body;
        let message = '';
        try {
            for (let index = 0; index < amounts.length; index++) {
                try {
                    const amount = amounts[index];
                    const slug = slugs[index];
                    const product = await Product.findOne({ slug: slug });
                    await buyProductService(slug, amount);
                    await Cart.deleteOne({ user: res.locals.user.id, product: product._id });
                } catch (error) {
                    message += `${slugs[index]}, `;
                }
            }

            req.session.error = message ? `Sản phẩm ${message} đã hết hàng` : 'Mua sản phẩm thành công !';
            res.redirect(`/cart`);
        } catch (error) {
            req.session.error = error.message;
            res.redirect(`/cart`);
        }
    }
    async removeCart(req, res) {
        const id = req.params.id;
        try {
            await Cart.deleteOne({ _id: id });
            req.session.error = 'Đã xóa sản phẩm khỏi giỏ hàng';
            res.redirect(`/cart`);
        } catch (error) {
            req.session.error = error;
            res.redirect(`/cart`);
        }
    }
    async productDetail(req, res) {
        const slug = req.params.slug;
        const error = req.session.error;
        req.session.error = null;
        try {
            const product = await Product.findOne({ slug: slug });
            const products = await Product.find().limit(4);
            res.render('productDetail', {
                product: mongooseToObject(product),
                products: multipleMongooseToObject(products),
                error,
            });
        } catch (error) {
            res.render('productDetail', { error });
        }
    }
}
const productController = new ProductController();

module.exports = productController;
