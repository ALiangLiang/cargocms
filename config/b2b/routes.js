module.exports = {
  '/': {
    controller: 'b2b/ProductController',
    action: 'index'
  },

  'get /product': 'b2b/ProductController.index',
  'get /product/:id': 'b2b/ProductController.detail',

  'get /order/form': {
    controller: 'b2b/OrderController',
    action: 'orderForm'
  },

  'get /orderhistory': 'api/OrderController.getOrderHistory',

  'get /ship/*': function(req, res, next) {
    res.sendfile(sails.config.appPath + '/react-app-ship/dist/index.html');
  },

  'get /api/admin/category': 'api/admin/CategoryController.find',
  'get /api/admin/category/:id': 'api/admin/CategoryController.findOne',
  'post /api/admin/category': 'api/admin/CategoryController.create',
  'put /api/admin/category/:id': 'api/admin/CategoryController.update',
  'delete /api/admin/category/:id': 'api/admin/CategoryController.destroy',

  'get /api/admin/categorydescription': 'api/admin/CategoryDescriptionController.find',
  'get /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.findOne',
  'post /api/admin/categorydescription': 'api/admin/CategoryDescriptionController.create',
  'put /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.update',
  'delete /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.destroy',

  'get /api/admin/productoption': 'api/admin/ProductOptionController.find',
  'get /api/admin/productoption/:id': 'api/admin/ProductOptionController.findOne',
  'post /api/admin/productoption': 'api/admin/ProductOptionController.create',
  'put /api/admin/productoption/:id': 'api/admin/ProductOptionController.update',
  'delete /api/admin/productoption/:id': 'api/admin/ProductOptionController.destroy',

  'get /api/admin/productimage': 'api/admin/ProductImageController.find',
  'get /api/admin/productimage/:id': 'api/admin/ProductImageController.findOne',
  'post /api/admin/productimage': 'api/admin/ProductImageController.create',
  'put /api/admin/productimage/:id': 'api/admin/ProductImageController.update',
  'delete /api/admin/productimage/:id': 'api/admin/ProductImageController.destroy',

  'get /admin/confirmorder/:id': 'admin/ConfirmOrderController.show',
  'get /api/admin/confirmorder/:id': 'api/admin/ConfirmOrderController.findOne',
  'put /api/admin/order/confirm/:id': 'api/admin/ConfirmOrderController.confirm',

  'get /api/admin/qa': 'api/admin/qacontroller.find',
  'get /api/admin/qa/:id': 'api/admin/qacontroller.findone',
  'post /api/admin/qa': 'api/admin/qacontroller.create',
  'put /api/admin/qa/:id': 'api/admin/qacontroller.update',
  'delete /api/admin/qa/:id': 'api/admin/qacontroller.destroy',

  '/validate/email':  'b2b/MainController.validateEmail',
  '/edit/me':  'b2b/MainController.editPofile',
  '/update/password': 'b2b/MainController.updatePassword',
};
