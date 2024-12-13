const { addProductService, deleteProductService, updateProductService } = require('../../services/ProductService');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

const Product = require('../Model/Product');

class AdminController {
    async index(req, res) {
        try {
            const products = await Product.find();
            const error = req.session.error;
            req.session.error = null;
            res.render('admin/main', { products: multipleMongooseToObject(products), error });
        } catch (error) {
            res.render('admin/main');
        }
    }
    async addProduct(req, res) {
        try {
            const data = req.body;
            addProductService(data);
            req.session.error = 'Thêm sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            res.redirect('/admin');
        }
    }

    async edit(req, res) {
        const product = await Product.findOne({ slug: req.params.slug });
        res.render('admin/edit', {
            product: mongooseToObject(product),
        });
    }
    async editProduct(req, res) {
        try {
            const data = req.body;
            const slug = req.params.slug;
            await updateProductService({ slug, ...data });
            req.session.error = 'Sửa sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            req.session.error = 'Sửa sản phẩm thất bại !';
            res.redirect('/admin');
        }
    }
    async deleteProduct(req, res) {
        try {
            const slug = req.params.slug;
            await deleteProductService(slug);
            req.session.error = 'Xóa sản phẩm thành công !';
            res.redirect('/admin');
        } catch (error) {
            console.log(error);

            req.session.error = 'Xóa sản phẩm thất bại !';
            res.redirect('/admin');
        }
    }
}
const adminController = new AdminController();

module.exports = adminController;
