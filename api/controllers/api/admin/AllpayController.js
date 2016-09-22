import allPayPaymentTypeJson from '../../../../config/allpayPaymentType.json';

module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        const include = {
          model: RecipeOrder,
          include: [User, Recipe]
        }
        result = await PagingService.process({ query, modelName, include });
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
      // const allpayData = {
      //   TradeNo: data.TradeNo,
      //   MerchantTradeNo: data.MerchantTradeNo,
      //   RtnCode: data.RtnCode,
      //   RtnMsg: data.RtnMsg,
      //   PaymentDate: data.PaymentDate,
      //   TradeDate: data.TradeDate,
      //   PaymentType: data.PaymentType,
      //   ShouldTradeAmt: data.ShouldTradeAmt,
      //   TradeAmt: data.TradeAmt,
      //   BankCode: data.BankCode,
      //   vAccount: data.vAccount,
      //   ExpireDate: data.ExpireDate,
      //   PaymentNo: data.PaymentNo,
      //   Barcode1: data.Barcode1,
      //   Barcode2: data.Barcode2,
      //   Barcode3: data.Barcode3,
      //   CheckMacValue: data.CheckMacValue,
      //   MerchantTradeDate: data.MerchantTradeDate,
      //   RecipeOrderId: data.RecipeOrderId,
      // };
      const recipeData = {
        recipient: data.Recipient,
        address: data.Address,
        phone: data.Phone,
        email: data.Email,
        note: data.Note,
        remark: data.Remark,
        productionStatus: data.RecipeOrder.productionStatus,
      };

      // const allpay = await Allpay.update(allpayData ,{
      //   where: { id, },
      // });

      const order = await RecipeOrder.update(recipeData, {
        where: { id: data.RecipeOrderId, },
      });

      res.ok({ message, data: { order } });
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
      const allpay = await AllpayService.paid(data);

      //  create and send message
      let messageConfig = {};
      messageConfig.serialNumber = allpay.TradeNo;
      if (allpay.RecipeOrderId) {
        const recipeOrder = await RecipeOrder.findByIdHasJoin(allpay.RecipeOrderId);
        recipeOrder.productionStatus = 'PAID';
        await recipeOrder.save();
        messageConfig.email = recipeOrder.email;
        messageConfig.username = recipeOrder.User.displayName;
      }
      messageConfig = await MessageService.paymentConfirm(messageConfig);
      const message = await Message.create(messageConfig);
      await MessageService.sendMail(message);

      res.send('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  },

  paymentinfo: async(req, res) => {
    try {
      const data = req.body;
      sails.log.info(data);
      const allpay = await AllpayService.paymentinfo(data);

      //  create and send message
      let messageConfig = {};
      messageConfig.serialNumber = allpay.TradeNo;
      messageConfig.paymentTotalAmount = allpay.ShouldTradeAmt;
      messageConfig.bankName = allPayPaymentTypeJson[allpay.PaymentType] || allpay.PaymentType;
      messageConfig.bankId = allpay.BankCode;
      messageConfig.accountId = allpay.vAccount;
      messageConfig.expireDate = allpay.ExpireDate;
      if (allpay.RecipeOrderId) {
        const recipeOrder = await RecipeOrder.findByIdHasJoin(allpay.RecipeOrderId);
        messageConfig.productName = recipeOrder.Recipe.perfumeName + ' 100 ml';
        messageConfig.email = recipeOrder.email;
        messageConfig.username = recipeOrder.User.displayName;
        messageConfig.shipmentUsername = recipeOrder.recipient;
        messageConfig.shipmentAddress = recipeOrder.address;
        messageConfig.note = recipeOrder.note;
        messageConfig.phone = recipeOrder.phone;
        messageConfig.invoiceNo = recipeOrder.invoiceNo;
      }
      messageConfig = await MessageService.orderConfirm(messageConfig);
      const message = await Message.create(messageConfig);
      await MessageService.sendMail(message);

      res.send('1|OK');
    } catch (e) {
      res.serverError(e);
    }
  },

  export: async (req, res) => {
    try {
      let { query, options } = req;
      sails.log.info('export', query);
      const modelName = options.controller.split("/").reverse()[0];
      const include = {
        model: RecipeOrder,
        include: [User, Recipe]
      }
      const content = await ExportService.query({ query, modelName, include });
      const columns = {
        id: "ID",
        TradeNo: "交易編號",
        MerchantTradeNo: "廠商交易編號",
        RtnMsg: "交易訊息",
        PaymentDate: "付款時間",
        PaymentTypeDesc: "付款方式",
        invoiceNo: "發票號碼",
        TradeAmt: "付款金額",
        vAccount: "付款帳號",
        ItemNameArray: "訂購物品",
        UserName: "訂購人",
        RecipeId: "配方編號",
        productionStatusDesc: "訂單狀態",
        scent0: '香味分子 1',
        scentPercent0: '香味分子 1 比例',
        scent1: '香味分子 2',
        scentPercent1: '香味分子 2 比例',
        scent2: '香味分子 3',
        scentPercent2: '香味分子 3 比例',
        scent3: '香味分子 4',
        scentPercent3: '香味分子 4 比例',
        scent4: '香味分子 5',
        scentPercent4: '香味分子 5 比例',
        scent5: '香味分子 6',
        scentPercent5: '香味分子 6 比例',
        Email: "Email",
        Phone: "電話",
        Address: "住址",
        createdAt: "訂單建立時間"
      }
      const format = (items) => {
        let result = items.map((data) => {
          sails.log.debug(data);
          let formatted = {
            id: data.id,
            TradeNo: data.TradeNo ? `="${data.TradeNo}"` : '訂單尚未成立',
            MerchantTradeNo: data.MerchantTradeNo,
            RtnMsg: data.RtnMsg,
            PaymentDate: data.PaymentDate == "Invalid date" ? '' : data.PaymentDate,
            PaymentTypeDesc: data.PaymentTypeDesc,
            invoiceNo: `="${data.invoiceNo || ''}"`,
            TradeAmt: `="${data.TradeAmt || ''}"`,
            vAccount: `="${data.vAccount || ''}"`,
            ItemNameArray: data.ItemNameArray,
            UserName: data.UserName,
            RecipeId: data.RecipeOrder.RecipeId,
            productionStatusDesc: data.RecipeOrder.productionStatusDesc,
            Email: data.Email,
            Phone: `="${data.Phone || ''}"`,
            Address: data.Address,
            createdAt: new Date(data.createdAt).toISOString(),
          }
          if (data.RecipeOrder && data.RecipeOrder.Recipe) {
            data.RecipeOrder.Recipe.formula.forEach((formula, index) => {
              if (formula.scent && formula.drops > 0) {
                formatted[`scent${index}`] = `${formula.scent}, ${formula.drops} 滴`,
                formatted[`scentPercent${index}`] = Math.ceil(formula.drops / data.RecipeOrder.Recipe.formulaTotalDrops * 1000000)/10000;
              }
            });
          }
          return formatted;
        });
        return result;
      }

      const result = await ExportService.export({
        fileName: modelName,
        content,
        format,
        columns,
      });
      res.attachment(result.fileName);
      res.end(result.data, 'UTF-8');
    } catch (e) {
      res.serverError(e);
    }
  },
}
