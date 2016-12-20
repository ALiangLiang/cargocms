module.exports = {


  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        const include = [];
        result = await PagingService.process({ query, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include: []
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
      const item = await SupplierShipOrder.findOne({
        where:{
          id
        },
        include: []
      });
      res.ok({data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      let data = req.body;
      const item = await SupplierShipOrder.create(data);
      let message = 'Create success.';
      res.ok({ message, data: { item } } );
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const message = 'Update success.';
      const item = await SupplierShipOrder.update(data ,{
        where: { id, },
      });
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await SupplierShipOrder.destroy({ where: { id } });
      let message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  status: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let findSupplierShipOrderDescription = await SupplierShipOrderDescription.findAll({
        where: {
          SupplierShipOrderId: id
        }
      });
      console.log(findSupplierShipOrderDescription);
      let supplierShipOrderDescriptionIdArray = findSupplierShipOrderDescription.map((desc) => {
        desc = desc.toJSON();
        return desc.id;
      })

      const updateSupplierShipOrderStatus = (transaction) => {
        return new Promise(function(resolve, reject) {
          SupplierShipOrder.update({ status },{ where: { id }}, { transaction })
          .then(function(updateSupplierShipOrder) {
            resolve(updateSupplierShipOrder);
          })
          .catch(function(err) {
            reject(err)
          });
        });
      }

      const updateSupplierShipOrderDescriptionStatus = (transaction) => {
        return new Promise(function(resolve, reject) {
          SupplierShipOrderDescription.update({
            status: 'PROCESSING'
          }, {
            where: {
              id: supplierShipOrderDescriptionIdArray
            }
          }, {transaction})
          .then(function(updateSupplierShipOrder) {
            resolve(updateSupplierShipOrder);
          })
          .catch(function(err) {
            reject(err)
          });
        });
      }

      const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      let transaction;
      return sequelize.transaction({ isolationLevel })
      .then(function (t) {
        transaction = t;
        return updateSupplierShipOrderStatus(transaction)
      })
      .then(function() {
        return updateSupplierShipOrderDescriptionStatus(transaction);
      })
      .then(function(){
        transaction.commit();
        let message = 'update status success';
        return res.ok({ message });
      })
      .catch(function(err) {
        sails.log.error('更新狀態失敗', err.toString());
        transaction.rollback();
        return res.serverError(err);
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
