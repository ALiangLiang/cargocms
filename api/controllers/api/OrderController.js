module.exports = {
  createOrder: async(req, res) => {
    const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await sequelize.transaction({
      isolationLevel
    });
    try {
      let data = req.body;
      const loginUser = AuthService.getSessionUser(req);
      data.UserId = loginUser.id;

      if (data.firstname !== loginUser.firstName || data.lastname !== loginUser.lastName) {
        data.firstname = loginUser.firstName;
        data.lastname = loginUser.lastName;
      }

      // some data can fetch from request
      data.userAgent = req.header["user-agent"] || '';
      data.ip = req.ip;
      // not sure which should record
      data.forwardedIp = req.headers["X-Real-IP"] || '';
      // data.forwardedIp = req.headers["X-Forwarded-For"] || '';
      data.acceptLanguage = req.header["accept-language"] || '';

      // check Product Numbers
      const products = JSON.parse(data.products);
      const stock = await ProductService.checkStock({
        transaction,
        products
      });
      if (!stock) throw Error('訂購的產品庫存量不足！');

      const order = await OrderService.createOrder(transaction, data);
      transaction.commit();

      try {
        const orderProductStringTable = await OrderService.stringOrderProduct({
          modelName: 'orderproduct',
          orderId: order.id
        });

        let mailMessage = {};
        mailMessage.serialNumber = order.orderNumber;
        mailMessage.paymentTotalAmount = order.total;
        mailMessage.productName = orderProductStringTable;
        mailMessage.email = order.email;
        mailMessage.username = `${order.lastname}${order.firstname}`;
        mailMessage.shipmentUsername = `${order.lastname}${order.firstname}`;
        mailMessage.shipmentAddress = order.shippingAddress1;
        mailMessage.note = order.comment;
        mailMessage.phone = order.telephone;
        // mailMessage.invoiceNo = `${order.invoicePrefix}${order.invoiceNo}`;
        let messageConfig = await MessageService.orderCreated(mailMessage);
        let mail = await Message.create(messageConfig);
        await MessageService.sendMail(mail);

        if (order.email !== order.shippingEmail) {
          mailMessage.email = order.shippingEmail;
          messageConfig = await MessageService.orderCreated(mailMessage);
          let shippingMail = await Message.create(messageConfig);
          await MessageService.sendMail(shippingMail);
        }

        if (loginUser.email !== order.email && loginUser.email !== order.shippingEmail) {
          mailMessage.email = loginUser.email;
          messageConfig = await MessageService.orderCreated(mailMessage);
          let accountMail = await Message.create(messageConfig);
          await MessageService.sendMail(accountMail);
        }

      } catch (e) {
        sails.log.error(e);
      }

      const message = 'Order create success';
      return res.ok({
        message,
        data: {
          item: {
            orderNumber: order.orderNumber
          }
        }
      })

    } catch (e) {
      transaction.rollback();
      res.serverError(e);
    }
  },

  getOrderInfo: async(req, res) => {
    try {
      const orderNumber = req.params.orderNumber;
      const order = await Order.findOne({
        where: {
          orderNumber
        },
        include: [User, OrderStatus]
      });
      const loginUser = AuthService.getSessionUser(req);
      let message = '';
      if (!order) {
        return res.notFound();
      }

      if (!loginUser || loginUser.id !== order.UserId) {
        message = '您沒有足夠權限瀏覽此網頁';
        return res.forbidden(message);
      }

      const orderProduct = await OrderProduct.findAll({
        where: {
          OrderId: order.id
        }
      })

      message = 'get Order info success';


      // get all payment methods from db
      let paymentMethods = await Config.findAll({
        where: {
          name: 'paymentSetting'
        }
      })
      
        // if nothing in DB, use default method in config/local.js
      if (paymentMethods.length === 0)
        paymentMethods = JSON.parse(sails.config.defaultPaymentMethods) || [] // if nothing in config/local.js, empty methods

      res.view('b2b/order/index', {
        message: message,
        data: {
          item: order,
          product: orderProduct,
          paymentMethods: paymentMethods || []
        }
      });

    } catch (e) {
      res.serverError(e);
    }
  },
  getOrderHistory: async(req, res) => {
    try {
      let user = AuthService.getSessionUser(req);

      let message = ''
      if (!user) {
        message = '您沒有權限瀏覽此網頁，請先登入。';
        return res.forbidden(message);
      }

      const items = await Order.findAll({
        where: {
          UserId: user.id
        },
        include: [OrderStatus, OrderProduct],
        order: [
          ['createdAt', 'DESC']
        ],
      })

      message = 'get order history success.';
      res.view('b2b/order/orderhistory', {
        message,
        data: {
          items
        }
      });

    } catch (e) {
      res.serverError(e);
    }
  }
}
