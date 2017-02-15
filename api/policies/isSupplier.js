/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  sails.log.error("## check user account Role is supplier ##")
  if (sails.config.offAuth || AuthService.isSupplier(req) || AuthService.isAdmin(req)) {
    return next();
  }
  req.flash('error', 'Error.NoPermitted');

  return res.forbidden('You are not permitted to perform this action.');
};
