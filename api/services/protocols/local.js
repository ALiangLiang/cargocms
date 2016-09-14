var validator = require('validator');

exports.register = async (req, res, next) => {
  var email, password, username;
  email = req.param('email');
  username = req.param('username');
  password = req.param('password');

  let lastName = req.param('lastName');
  let firstName = req.param('firstName');

  try {

    if (!email) {
      throw new Error('No email was entered.');
    }

    if (!password) {
      throw new Error('No password was entered.');
    }

    let newUserParams = req.body;

    let newUser = {
      username: newUserParams.username || email,
      email: email,
      lastName,
      firstName
    }

    let user = await User.create(newUser);

    let passport = await Passport.create({
      protocol: 'local',
      password: password,
      UserId: user.id
    });

    user = await User.findOne({
      where:{
        id: user.id
      },
      include: [Role]
    });
    return next(null, user);

  } catch (err) {
    console.error(err.stack);
    req.flash('error', err.message);
    return next(err);

  }
};



exports.connect = async (req, res, next) => {
  console.info("=== protocol local connect ===");
  var password, user;
  user = req.user;
  password = req.param('password');

  try {
    let passport = await Passport.find({
      protocol: 'local',
      UserId: user.id
    });
    if (!passport) {
      await Passport.create({
        protocol: 'local',
        password: password,
        UserId: user.id
      });
    }
    ext(null, user);

  } catch (e) {
    return next(e);
  }
};


exports.login = async (req, identifier, password, next) => {
  console.info("=== protocol local login ===");
  try {
    var isEmail, query;
    isEmail = validator.isEmail(identifier);
    query = {
      where: {},
      include: [Role]
    };

    if (isEmail) {
      query.where.email = identifier;
    } else {
      query.where.username = identifier;
    }
    let user = await User.findOne(query);
    console.log("== user ==", user.toJSON());
    if (!user) {
      if (isEmail) {
        throw new Error('Error.Passport.Email.NotFound');
      } else {
        throw new Error('Error.Passport.Username.NotFound');
      }
    }

    let passport = await Passport.findOne({
      where: {
        UserId: user.id
      }
    })

    if (passport) {
      let result = await passport.validatePassword(password);
      if (result) {
        const userAgent = req.headers['user-agent'];
        await user.loginSuccess({ userAgent });
        return next(null, user);
      } else {
        throw new Error('Error.Passport.Password.CheckFail');
      }

    } else {
      throw new Error('Error.Passport.Password.NotSet');
    }

  } catch (e) {
    sails.log.error(e.stack);
    next(e);
  }
};
