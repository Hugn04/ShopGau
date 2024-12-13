const { createUserService, loginUserService } = require('../../services/AccountService');

class UserController {
    async register(req, res) {
        const { name, email, password } = req.body;
        try {
            req.session.error = 'Tạo tài khoản thành công !';
            await createUserService(name, email, password);
            res.redirect('/');
        } catch (err) {
            req.session.error = err.message;
            res.redirect('/account');
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        try {
            req.session.error = 'Đăng nhập thành công !';
            const token = await loginUserService(email, password);
            res.setHeader('Set-Cookie', `token=${token}; max-age=3600; httpOnly`);
            res.redirect('/');
        } catch (err) {
            req.session.error = err.message;
            res.redirect('/account');
        }
    }

    logout(req, res) {
        res.clearCookie('token', { httpOnly: true, secure: true, path: '/' });

        res.redirect('/');
    }
    account(req, res) {
        const error = req.session.error;
        req.session.error = null;
        res.render('account', { error });
    }
}
const userController = new UserController();

module.exports = userController;
