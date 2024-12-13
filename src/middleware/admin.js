require('dotenv').config();
const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = user;

        if (user.role === 'admin') {
            next();
        } else {
            req.session.error = 'Bạn không phải là admin !';
            res.redirect('/');
        }
    } catch (error) {
        req.session.error = 'Bạn phải đăng nhập mới vào được trang này !';
        res.locals.user = null;
        res.redirect('/');
    }
};
module.exports = admin;
