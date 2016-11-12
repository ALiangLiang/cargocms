module.exports = {
  create: async ( data ) => {
    try{
      let item;
      let sameTitle = await Feeling.findOne({
        where:{
          title: data.title
        }
      });

      data.totalRepeat = "1";
      data.score = "1";

      if (!sameTitle){
        item = await Feeling.create(data);
      } else {
        let newTotalRepeat = ( Number(sameTitle.totalRepeat) + 1).toString();

        sameTitle = await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where:{
            title: data.title
          }
        });

        data.totalRepeat = newTotalRepeat;
        item = await Feeling.create(data);
      }

      await ScentService.updateByFeeling(data);

      return item;
    }
    catch(e){
      sails.log.error(e);
      throw e;
    }
  },

  update: async ( id , data ) => {
    try{
      let oldFeeling = await Feeling.findById(id);
      let item;
      const needDeleteScentKey = oldFeeling.title;

      if( oldFeeling.title !== data.title ){

        if(oldFeeling.totalRepeat > 1){
          let oldTitleNewTotalRepeat = (Number(oldFeeling.totalRepeat) - 1).toString();
          await Feeling.update({
            totalRepeat: oldTitleNewTotalRepeat
          },{
            where:{
              title: oldFeeling.title
            }
          });
        }

        let newTitleTotalRepeat = await Feeling.findOne({ where:{ title: data.title }});
        newTitleTotalRepeat = (Number(newTitleTotalRepeat.totalRepeat) + 1).toString();

        oldFeeling.title = data.title;
        oldFeeling.score = data.score;
        item = await oldFeeling.save();

        await Feeling.update({
          totalRepeat: newTitleTotalRepeat
        },{
          where:{
            title: item.title
          }
        });

      } else if( oldFeeling.score !== data.score) {
        oldFeeling.score = data.score;
        item = await oldFeeling.save();
      } else {
        item = oldFeeling;
      }

      await ScentService.deleteByFeeling( oldFeeling.scentName, needDeleteScentKey);
      await ScentService.updateByFeeling( item );

      return item;

    } catch (e){
      sails.log.error(e);
      throw e;
    }
  },

  destroy: async ( id ) => {
    try{
      let item, scent;
      let feeling = await Feeling.findById(id);

      await ScentService.deleteByFeeling(feeling.scentName , feeling.title);

      // scent = await Scent.findOne({
      //   where: {
      //     name: feeling.scentName
      //   }
      // });
      //
      // let scentFeelings = scent.feelings;
      // for(let i = 0, len = scentFeelings.length; i < len; i++){
      //   if(scentFeelings[i].key === feeling.title){
      //     scentFeelings.splice( i , 1);
      //     break;
      //   }
      // }
      // scent.feelings = scentFeelings;
      // await scent.save();

      if( Number(feeling.totalRepeat) > 1 ){
        let newTotalRepeat = (Number(feeling.totalRepeat) - 1).toString();

        await Feeling.update({
          totalRepeat: newTotalRepeat
        },{
          where: {
            title: feeling.title
          }
        });
      }

      item = await Feeling.deleteById(id);

      return item;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

}
