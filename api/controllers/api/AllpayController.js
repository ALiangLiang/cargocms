module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        result = await PagingService.process({query, modelName});
      } else {
        const items = await sails.models[modelName].findAll({
          include:{
            model: RecipeOrder,
            include: [User, Recipe]
          }
        });
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: RecipeOrder,
          include: [User, Recipe]
        }
       });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const message = 'Update success.';
      //allpay , recipeOrder 分拆更新資料
      const allpayData = {
        TradeNo: data.TradeNo,
        MerchantTradeNo: data.MerchantTradeNo,
        RtnCode: data.RtnCode,
        RtnMsg: data.RtnMsg,
        PaymentDate: data.PaymentDate,
        TradeDate: data.TradeDate,
        PaymentType: data.PaymentType,
        ShouldTradeAmt: data.ShouldTradeAmt,
        TradeAmt: data.TradeAmt,
        BankCode: data.BankCode,
        vAccount: data.vAccount,
        ExpireDate: data.ExpireDate,
        PaymentNo: data.PaymentNo,
        Barcode1: data.Barcode1,
        Barcode2: data.Barcode2,
        Barcode3: data.Barcode3,
        CheckMacValue: data.CheckMacValue,
        MerchantTradeDate: data.MerchantTradeDate,
        RecipeOrderId: data.RecipeOrderId,
      };
      const recipeData = {
        recipient: data.recipient,
        address: data.Address,
        phone: data.Phone,
        email: data.Email,
        note: data.Note,
        remark: data.Remark,
      };

      const allpay = await Allpay.update(allpayData ,{
        where: { id, },
      });

      const order = await RecipeOrder.update(recipeData, {
        where: { id: data.RecipeOrderId, },
      });

      res.ok({ message, data: { allpay, order} });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeOrder = await Allpay.findOne({
        where:{
          id
        },
        include:{
          model: RecipeOrder,
          include: [User, Recipe]
        }
       });

      const allpay = await Allpay.deleteById(id);
      const order = await RecipeOrder.deleteById(recipeOrder.RecipeOrderId);

      const message = 'Delete success.';
      res.ok({ message, data: { allpay, order } });
    } catch (e) {
      res.serverError(e);
    }
  },

  paid: async (req, res) => {
    try {
      const data = req.body;
      sails.log.info(data);
      await AllpayService.paid(data);
      return res.ok('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  },

  paymentinfo: async(req, res) => {
    try {
      const data = req.body;
      sails.log.info(data);
      await AllpayService.paymentinfo(data);
      return res.ok('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  }
}
