import FacebookHelper from './libraries/facebook/'
import FB from "fb"
module.exports = {
  getProfileWithLocale: async ({token, identifier, locale}) => {
    try {
      let facebookHelper = new FacebookHelper({identifier, token});
      let result = await facebookHelper.getProfileWithLocale({locale});
      return result;
    } catch (e) {
      throw e;
    }
  },

  feedsImport: async () => {
    try {

      console.log('>>>> config/init/facebook >>>>');

      if (!sails.config.facebook || !sails.config.facebook.accessToken) {
        console.log('<<< error: config/init/facebook => facebook.accessToken config undefined');
        return;
      }

      FB.setAccessToken(sails.config.facebook.accessToken);

      const feedUrl = "/"+sails.config.facebook.pageId+"/feed?limit=100&fields=full_picture,name,message,story,description,type,link";
      //?fields=full_picture,name,message,story,description,type

      console.log('Feed URL: ' + feedUrl);

      let feeds = await new Promise(function(resolve, reject) {
        FB.api(feedUrl, (response) => {
            if (response && !response.error) {
              resolve(response.data)
            } else {
              throw new Error("can not get feed data.");
            }
          }
        );
      });

      let feedsSourceId = feeds.map((feed) => feed.id);

      let findFeeds = await Feed.findAll({
        where: {sourceId: feedsSourceId},
        attributes: ["sourceId"]
      });

      let sourcesId = findFeeds.map((feed) => feed.sourceId);

      let createFeeds = feedsSourceId.reduce((results, feedSourceId, index) => {
        if(sourcesId.indexOf(feedSourceId) == -1){
          let row = {
            fullPicture: feeds[index].full_picture,
            name: feeds[index].name,
            message: feeds[index].message,
            story: feeds[index].story,
            description: feeds[index].description,
            type: feeds[index].type,
            link: feeds[index].link,
            createdAt: feeds[index].created_time,
            sourceId: feeds[index].id
          };
          results.push(row)
          return results;
        }
        return results
      }, [])

      console.log("== createFeeds ==", createFeeds);

      Feed.bulkCreate(createFeeds);

      console.log('<<< done: config/init/facebook <<<');

    } catch (e) {
      throw e;
    }
  }
}
