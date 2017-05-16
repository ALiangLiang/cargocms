module.exports = {
  orderForm: async (req, res) => {
    if (!AuthService.isAuthenticated(req)){
      res.redirect('/');
    }

    const token = await UtilsService.tokenGenerator();
    res.view(
      'b2b/order/form',
      {
        token,
        data: {
          paymentMethods: JSON.parse(sails.config.paymentMethods)
        }
      }
    );
  },
}
