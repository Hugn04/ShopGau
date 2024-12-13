require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    //const white_list = ['/', '/login', '/register'];
    const token = req.cookies.token;
    const white_list = ['/', '/login', '/register', '/logout', '/account', '/products'];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.locals.user = decoded;
        next();
    } catch (error) {
        if (white_list.includes(req.originalUrl)) {
            res.locals.cart = { length: 0 };

            next();
        } else {
            req.session.error = 'Bạn phải đăng nhập mới vào được trang này !';
            res.locals.user = null;
            res.redirect('/');
        }
    }
    // next();
    // if (white_list.includes(req.originalUrl)) {
    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         let cart = await Cart.find({ user: decoded.id })
    //             .sort({ _id: -1 })
    //             .populate('product', 'title image category price');
    //         cart = multipleMongooseToObject(cart);
    //         res.locals.user = decoded;
    //         res.locals.cart = { item: cart, length: cart.length };
    //     } catch (error) {}
    //     next();
    // } else {
    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         let cart = await Cart.find({ user: decoded.id })
    //             .sort({ _id: -1 })
    //             .limit(4)
    //             .populate('product', 'title image category price');
    //         console.log(cart);
    //         cart = multipleMongooseToObject(cart);
    //         res.locals.user = decoded;
    //         res.locals.cart = { item: cart, length: cart.length };
    //         next();
    //     } catch (error) {
    //         req.session.error = 'Bạn phải đăng nhập mới vào được trang này !';
    //         res.locals.user = null;
    //         res.redirect('/');
    //     }
    // }
};
module.exports = auth;
