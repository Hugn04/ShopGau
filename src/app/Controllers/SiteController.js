class SiteController {
    async index(req, res) {
        const error = req.session.error;
        req.session.error = null;
        res.render('home', { error });
    }
}
const siteController = new SiteController();

module.exports = siteController;
