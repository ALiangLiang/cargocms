import createHelper from "../../../util/createHelper.js"
import { mockAdmin, unMockAdmin } from "../../../util/adminAuthHelper.js"

describe.only('about Order controllers', () => {

  let product1, product2, product3 , user;
  before(async function(done){
    try{
      user = await User.create({
        username: 'buyer',
        email: 'buyer@example.com',
        firstName: '劉',
        lastName: '拜爾',
        birthday: new Date(),
        phone1: '(04)2201-9020',
        phone2: '0900-000-000',
        address: '西區台灣大道二段2號16F-1',
        address2: '台中市',
      });

      await mockAdmin();

      product1 = await createHelper.product('Product A');
      product2 = await createHelper.product('Product B');
      product3 = await createHelper.product('Product C');

      await createHelper.orderStatus();

      done();
    } catch (e) {
      done(e);
    }
  });

  after(async (done) => {
    await createHelper.deleteAllOrderStatus();
    await unMockAdmin();
    done();
  });

  it('User shopping car Order some Products.', async (done) => {
    try{
      const token = '8178e7c8e88a68321af84bc7b77e2e38';
      let product = [
        {
          id: product1.id,
          quantity: 3,
        },{
          id: product2.id,
          quantity: 2,
        },{
          id: product3.id,
          quantity: 5,
        }];
      product = JSON.stringify(product);

      const orderData = {
        lastname: '劉',
        firstname: '拜爾',
        products: product,
        telephone: '04-22019020',
        fax: '',
        email: 'buyer@gmail.com',
        shippingFirstname: '拜爾',
        shippingLastname: '劉',
        shippingAddress1: '台灣大道二段2號16F-1',
        county: '台中市',
        zipcode: '403',
        district: '西區',
        shippingMethod: '低溫宅配',
        shippingCode: 'ship123456',
        ip: '',
        forwardedIp: '',
        userAgent: '',
        comment: '這是一個訂購測試',
        token: token
      };


      const res = await request(sails.hooks.http.app)
      .post(`/api/order`).set('Accept', 'application/json').send( orderData );


      res.status.should.be.eq(200);

      const order = await Order.findOne({
        where: {
          orderNumber: res.body.data.item.orderNumber
        }
      });

      const orderProduct = await OrderProduct.findAll({
        where: {
          OrderId: order.id
        }
      });

      orderProduct.length.should.be.equal(3);

      const orderHistory = await OrderHistory.findAll({
        where: {
          OrderId: order.id
        }
      });
      orderHistory.length.should.be.equal(1);

      const orderStatus = await OrderStatus.findOne({
        where: {
          name: 'NEW'
        }
      })
      orderHistory[0].OrderStatusId.should.be.equal(orderStatus.id);

      // const orderPayment = await OrderPayment.findOne({
      //   where: {
      //     id: order.OrderPaymentId
      //   },
      //   include: OrderPaymentStatus
      // });
      // orderPayment.status.should.be.eq('NEW');
      //
      // const orderPaymentHistory = await OrderPaymentHistory.findAll({
      //   where: {
      //     OrderPaymentId: orderPayment.id,
      //   },
      // });
      // orderPaymentHistory.length.should.be.eq(1);

      done();
    } catch (e) {
      done(e);
    }

  });

  it('Repeat Order ', async (done) => {
    try{
      let repeatOrder = [];

      const token = '9487e7c8e88a68321af84bc7b77e2168';
      let product = [
        {
          id: product1.id,
          quantity: 3,
        },{
          id: product2.id,
          quantity: 2,
        },{
          id: product3.id,
          quantity: 5,
        }];
      product = JSON.stringify(product);

      const orderData = {
        lastname: '日',
        firstname: '晶晶',
        products: product,
        telephone: '04-22019020',
        fax: '',
        email: 'buyer@gmail.com',
        shippingFirstname: '拜爾',
        shippingLastname: '劉',
        shippingAddress1: '台灣大道二段2號16F-1',
        county: '台中市',
        zipcode: '403',
        district: '西區',
        shippingMethod: '低溫宅配',
        shippingCode: 'ship654321',
        ip: '',
        forwardedIp: '',
        userAgent: '',
        comment: '這是一個訂購測試',
        token: token
      };

      repeatOrder.push(
        request(sails.hooks.http.app)
        .post(`/api/order`).set('Accept', 'application/json')
        .send( orderData )
      );
      repeatOrder.push(
        request(sails.hooks.http.app)
        .post(`/api/order`).set('Accept', 'application/json')
        .send( orderData )
      );

      const result = await Promise.all(repeatOrder);
      // console.log("====Promise result ===", result);

      const check = await Order.findAll({ where: { token }});
      check.length.should.be.eq(1);
      done();
    } catch(e){
      done(e);
    }
  });

  it('Order Controller get Order Info data', async(done) => {
    try{
      const order = await Order.findById(1);

      const res = await request(sails.hooks.http.app)
      .get(`/orderinfo/${order.orderNumber}`);

      res.status.should.be.eq(200);
      // res.body.data.item.invoiceNo.should.be.eq('87654321');
      // res.body.data.product.length.should.be.eq(3);

      done();
    } catch (e) {
      done(e);
    }
  });
});
