import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import axios from 'axios';

module.exports = {
  follow: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) res.forbidden();
      const data = { follower: loginUser.id, following: id };
      await Follow.findOrCreate({
        where: data,
        defaults: data
      });
      res.ok({ message: `follow ${id} success.`, data: {} });
    } catch (e) {
      res.serverError(e);
    }
  },

  unfollow: async (req, res) => {
    try {
      const { id } = req.params;
      const loginUser = AuthService.getSessionUser(req);
      if (!loginUser) res.forbidden();
      await Follow.destroy({
        where: {
          follower: loginUser.id,
          following: id,
        },
      });
      res.ok({ message: `unfollow ${id} success.`, data: {} });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      sails.log.info('update user controller id=>', id);
      sails.log.info('update user controller data=>', data);
      const { password, passwordConfirm } = data;
      const checkPwdEqual = password === passwordConfirm;

      if (checkPwdEqual) {
        const user = await UserService.updateByUser({
          id: id,
          ...data,
        });
        const checkLastName = user.lastName === data.lastName;
        const checkFirstName = user.firstName === data.firstName;
        const checkEmail = user.email === data.email;
        if (checkEmail && (checkFirstName && checkLastName)) {
          req.session.passport.user.displayName = user.displayName;
          req.session.passport.user.lastName = user.lastName;
          req.session.passport.user.firstName = user.firstName;
          req.session.passport.user.email = user.email;
          req.session.passport.user.local = user.local;
          req.session.passport.user.avatarThumb = user.avatarThumb;
          req.session.passport.user.avatar = user.avatar;
          res.send(req.session);
          // res.ok({
          //   message: 'Update user success.',
          //   data: user,
          // });
        } else {
          throw Error(`update user ${id} failed`);
        }
      } else {
        throw Error('error: user password and passwordConfirm is not equal!');
      }
    } catch (e) {
      res.serverError(e);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const secret = sails.config.reCAPTCHA.secret;
      const response = req.body['g-recaptcha-response'];
      const recaptcha = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`);
      if (!recaptcha.data.success) throw Error('請稍候再試');

      let user = await User.findOne({
        where: { email }
      })
      if (!user) throw Error('請確認 Email，該 Email 尚未註冊過');

      const resetPasswordToken = crypto.randomBytes(32).toString('hex').substr(0, 32);
      user.resetPasswordToken = resetPasswordToken;
      await user.save();

      const token = jwt.sign({
        exp: moment(new Date()).add(1, 'h').valueOf(),
        email: user.email
      }, resetPasswordToken);

      let messageConfig = await MessageService.forgotPassword({
        email: user.email,
        api: `/update/password?token=${token}`,
        username: user.displayName,
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);


      req.flash('info', '已給您發送重置密碼的連結，請至信箱確認');
      res.ok({
        message: `forgot success. send email`,
        data: {},
      }, {
        redirect: '/login'
      });
    } catch (e) {
      req.flash('error', e.message);
      res.serverError(e, { redirect: '/forgot'});
    }
  },


  updatePassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token) throw Error('請點擊 Email 連結以更新密碼');

      const decoded = jwt.decode(token);
      const timeout = moment(new Date()).valueOf() > decoded.exp;
      if (timeout) throw Error('更新密碼連結已逾時');

      let user = await User.findOne({
        where: {
          email : decoded.email
        },
        include: Passport,
      });
      if (!user) throw Error('請確認 Email，該 Email 尚未註冊過');
      if (!user.resetPasswordToken) throw Error('請點擊 Email 連結以更新密碼');

      jwt.verify(token, user.resetPasswordToken);

      let passport = await Passport.findById(user.Passports[0].id);
      passport.password = password;
      await passport.save();

      user.resetPasswordToken = '';
      await user.save();

      req.flash('info', '密碼已更新成功');
      res.ok({
        message:`update password success. send email`,
        data: {},
      }, {
        redirect: '/login',
      });
    } catch (e) {
      req.flash('error', e.message);
      res.serverError(e, { redirect: '/update/password'});
    }
  },

}
