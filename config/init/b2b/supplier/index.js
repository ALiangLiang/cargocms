module.exports.init = async () => {
  try {
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {
      // const supplier = await Supplier.create({
      //   name: '壹陸捌活海產',
      //   email: '168_seafood@gmail.com',
      //   telephone: '(04)-2201-1688',
      //   fax: '(04)-2201-1168',
      //   address: '台中市清水區北提路'
      // });

      const supplier = await Supplier.findAll();
      // supplier 關聯 admin 使用者
      const user1 = await User.find({
        where: {
          username: 'admin'
        },
      });
      user1.SupplierId = supplier[0].id;
      await user1.save();

      const user2 = await User.find({
        where: {
          username: 'admin2'
        },
      });
      user2.SupplierId = supplier[1].id;
      await user2.save();

      const supplierRole = await Role.findOrCreate({
        where: {authority: 'supplier'},
        defaults: {authority: 'supplier'}
      });
      await user1.addRole(supplierRole[0]);
      await user2.addRole(supplierRole[0]);
    }
  } catch (e) {
    console.error(e);
  }
};
