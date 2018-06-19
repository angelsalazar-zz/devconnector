const passport = require('passport');

const credentialsAuth = passport.authenticate('local', { });

const jwtAuth = passport.authenticate('jwt', {
  session : false
});

module.exports = {
    credentialsAuth,
    jwtAuth
}