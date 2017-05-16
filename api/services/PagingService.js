import FacebookHelper from './libraries/facebook/';
import _ from 'lodash';
import util from 'util';

module.exports = {
  process: async({ query, modelName, include }) => {
    let findQuery = {};
    try {
      // console.log('query.where=>', query.where);
      if (!_.isNil(query.where)) {
        findQuery = {
          where: query.where,
        };
        if (_.has(query.where, 'deletedAt')) {
          findQuery.paranoid = false;
        }
      } else {
        findQuery = FormatService.getQueryObj(query);
      }
      if (include) {
        include = FormatService.getIncudeQueryObj({ include, query });
        findQuery.include = include;
      }
      const result = await sails.models[modelName].findAndCountAll(findQuery);
      const data = result.rows;
      const recordsTotal = data.length
      const recordsFiltered = result.count;
      const draw = parseInt(query.draw) + 1;
      // console.log('@@@@@@ findQuery=>', util.inspect(findQuery, { showHidden: true, depth: null }));
      // console.log('@@@@@@ findQuery result=>', result);
      return { draw, recordsTotal, recordsFiltered, data };
    } catch (e) {
      throw e;
    }
  },
}