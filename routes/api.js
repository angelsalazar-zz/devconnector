const { credentialsAuth,jwtAuth } = require('../middlewares/auth.middleware');
const UserCtrl = require('../controllers/user.controller');

module.exports = (express) => {
    const api = express.Router();

    api.route('/info')
        .get((req, res) => {
            res.json({
                version : '1.0.0'
            })
        });

    
    api.route('/signup')
        .post(UserCtrl.register);

    api.route('/signin')
        .post(credentialsAuth, UserCtrl.login);

    api.route('/me')
        .get(jwtAuth, UserCtrl.getAuthUser);

    return api;
}