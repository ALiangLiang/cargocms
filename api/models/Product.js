import moment from 'moment';

module.exports = {
  attributes: {
    model: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    //Stock-keeping units
    sku: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '0',
    },
    //universal product codes
    upc: {
      type: Sequelize.STRING(12),
      allowNull: false,
      defaultValue: '0',
    },
    //European article number
    ean: {
      type: Sequelize.STRING(14),
      allowNull: false,
      defaultValue: '0',
    },
    //Japanese Article Numbering
    jan: {
      type: Sequelize.STRING(13),
      allowNull: false,
      defaultValue: '0',
    },
    // International Standard Book Number
    isbn: {
      type: Sequelize.STRING(17),
      allowNull: false,
      defaultValue: '0',
    },
    // Manufacturer Part Number
    mpn: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '0',
    },

    location: {
      type: Sequelize.STRING(128),
      allowNull: false,
      defaultValue: 'tw',
    },

    origin: {
      type: Sequelize.STRING(128),
      allowNull: false,
      defaultValue: 'tw',
    },

    quantity: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: 0,
    },

    image: {
      type: Sequelize.STRING(255),
      defaultValue: null,
    },

    shipping: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    price: {
      type: Sequelize.DECIMAL(15,4),
      allowNull: false,
      defaultValue: '0.0000',
    },

    taxRate: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: sails.config.taxrate,
    },

    points: {
      type: Sequelize.INTEGER(8),
      allowNull: false,
      defaultValue: 0,
    },

    precautions: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    // taxClassId: {
    //   Sequelize.INTEGER(11),
    //   allowNull: false,
    // },

    dateAvailable: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get: function () {
        try {
          let dateTime = this.getDataValue('dateAvailable');
          if(dateTime){
            dateTime = UtilsService.DataTimeFormat(dateTime);
            return dateTime.date;
          }
          return '';
        } catch (e) {
          sails.log.error(e);
        }
      }
    },

    weight :{
      type: Sequelize.DECIMAL(15,8),
      allowNull: false,
      defaultValue: '0.00000000',
    },

    unit :{
      type: Sequelize.STRING(8),
      allowNull: false,
      defaultValue: '',
    },

    // weightClassId: {
    //   Sequelize.INTEGER(11),
    //   allowNull: false,
    //   defaultValue: 0,
    // },

    length: {
      type: Sequelize.DECIMAL(15,8),
      allowNull: false,
      defaultValue: '0.00000000',
    },

    width: {
      type: Sequelize.DECIMAL(15,8),
      allowNull: false,
      defaultValue: '0.00000000',
    },

    height: {
      type: Sequelize.DECIMAL(15,8),
      allowNull: false,
      defaultValue: '0.00000000',
    },

    // lengthClassId: {
    //   type: Sequelize.INTEGER(11),
    //   allowNull: false,
    //   defaultValue: 0,
    // },

    // 設定賣出時是否減少庫存
    subtract: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // 最小庫存數量
    minimum: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: 1,
    },

    sortOrder: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },

    publish: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    viewed: {
      type: Sequelize.INTEGER(5),
      allowNull: false,
      defaultValue: 0,
    },

    formatPrice: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          let price = this.getDataValue('price');
          if(!price){
            return '';
          }

          return UtilsService.moneyFormat(price);

        } catch(e){
          sails.log.error(e);
        }
      }
    },

    categoriesId: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          const tihsCategoies = this.getDataValue('Categories');
          const categories = tihsCategoies ? tihsCategoies.map((category) => category.id) : [];
          return categories;
        } catch(e){
          sails.log.error(e);
        }
      }
    },
    categoriesNameArray: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          const tihsCategoies = this.getDataValue('Categories');
          const categories = tihsCategoies ? tihsCategoies.map((category) => category.CategoryDescription.name) : [];
          return categories;
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    suppliersId: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          const tihsSuppliers = this.getDataValue('Suppliers');
          const suppliers = tihsSuppliers ? tihsSuppliers.map((supplier) => supplier.id) : [];
          return suppliers;
        } catch(e){
          sails.log.error(e);
        }
      }
    },
    suppliersNameArray: {
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          const tihsSuppliers = this.getDataValue('Suppliers');
          const suppliers = tihsSuppliers ? tihsSuppliers.map((supplier) => supplier.name) : [];
          return suppliers;
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    // stockStatusId: {
    //   type: Sequelize.INTEGER(11),
    //   allowNull: false,
    // },

    // manufacturerId: {
    //   type: Sequelize.INTEGER(11),
    //   allowNull: false,
    // },

    createdDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },

    updatedDateTime:{
      type: Sequelize.VIRTUAL,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    }

  },
  associations: function() {
    Product.hasOne(ProductTag);
    Product.hasOne(ProductDescription);
    Product.hasMany(ProductOption);
    Product.hasMany(ProductOptionValue);
    Product.hasMany(ProductImage);
    Product.belongsTo(Image);
    // Product.belongsTo(Supplier);
    Product.belongsToMany(Supplier, {
      through: 'ProductSupplier'
    });

    Product.belongsToMany(Category, {
      through: 'ProductCategory',
    });

    Product.hasMany(SupplierShipOrderProduct);
  },
  options: {
    paranoid: true,
    classMethods: {
      deleteById: async (id) => {
        try {
          return await Product.destroy({ where: { id } });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
      findByIdHasJoin: async ({id}) => {
        try {
          const include = [
            ProductTag,
            ProductDescription,
            ProductImage,
            Image,
            {
              model: ProductOption,
              include: {
                model: Option,
                include: [ OptionDescription, {
                    model: OptionValue,
                    include: OptionValueDescription
                  }
                ]
              }
            }, {
              model: ProductOptionValue,
              include: [{
                  model: Option,
                  include: OptionDescription
                }, {
                  model : OptionValue,
                  include: OptionValueDescription
                }]
            }
          ];
          return await Product.findOne({
            where: { id },
            include: include
          });
        } catch (e) {
          sails.log.error(e);
          throw e;
        }
      },
    },
    instanceMethods: {},
    hooks: {}
  }

}
