import jwt from 'jsonwebtoken';
import moment from 'moment';

module.exports = {

  editPofile: async function(req, res) {
    let user = null;
    let isMe = false;
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) return res.redirect('/');

      const user = await User.findOneWithPassport({ id: loginUser.id });
      if (user.verificationEmailToken) {
        req.flash('title', '恭喜您註冊完成！');
        req.flash('info', '請再次確認以下資料皆正確無誤，並請您到註冊時的信箱收取確認信以開通帳號！');
      }
      return res.view({
        user: user,
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  updatePassword: async function(req, res) {
    try {
      const { token } = req.query;
      res.ok({ token });
    } catch (e) {
      res.serverError(e);
    }
  },

  validateEmail: async(req, res) => {
    try {
      const { token } = req.query;
      const decoded = jwt.decode(token);

      if(!decoded){
        sails.log.error('Email 驗證 token 不合法');
        return res.notFound();
      }

      const timeout = moment(new Date()).valueOf() > decoded.exp;
      let message = '';
      let valid = false;

      // if (timeout) throw Error('驗證連結已逾時');
      if (timeout){
        message = 'E-Mail 驗證連結已逾時';
        sails.log.error('E-Mail 驗證連結已逾時');
      } else {
        let user = await User.findOne({
          where: {
            id: decoded.userId,
            email: decoded.email,
          }
        });
        // if (!user.verificationEmailToken) throw Error('請點擊 Email 驗證連結');

        if (!user || !user.verificationEmailToken){
          message = '此驗證連結已失效';
          sails.log.error('此驗證連結已失效');
        } else {

          jwt.verify(token, user.verificationEmailToken);
          user.verificationEmailToken = '';
          await user.save();

          if(AuthService.isAuthenticated(req)) {
            req.session.passport.user.verificationEmailToken = '';
            // res.send(req.session);
          }

          message = 'E-Mail 驗證成功';
          valid = true;
        }
      }

      res.ok({
        message,
        valid
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
