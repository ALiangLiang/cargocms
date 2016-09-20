var sinon = require('sinon');
describe('about export service operation.', function() {

  let recipe;
  before(async (done) => {
    try {
      let user = await User.create({
        username: 'JohnExport',
        email: 'JohnExport@gmail.com',
        password: ''
      });
      sinon.stub(AuthService, 'getSessionUser', (req) => {
        return user.toJSON();
      });
      recipe = await Recipe.create({
        formula:[
          {"drops":"1","scent":"BA69","color":"#E87728"},
          {"drops":"2","scent":"BA70","color":"#B35721"}
        ],
        formulaLogs: '',
        authorName: '王大明',
        perfumeName: 'John test perfume',
        message: 'this is love test',
        UserId: user.id,
      });
      console.log('create successful');
      done()
    } catch (e) {
      done(e)
    }
  });

  after((done) => {
    AuthService.getSessionUser.restore();
    done();
  });

  it('query Recipe to CSV with Date should be success.', async (done) => {
    try {
      const query = { draw: '1',
        type: 'csv',
        startDate: '1900/01/01',
        endDate: '3000/01/01',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'productionStatus', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      const result = await ExportService.query({query, modelName: 'recipe'});
      result.length.should.be.eq(1);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('query Recipe to CSV with Date should be success. all date', async (done) => {
    try {
      const query = { draw: '1',
        type: 'csv',
        startDate: '',
        endDate: '',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'productionStatus', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      const result = await ExportService.query({query, modelName: 'recipe'});
      result.length.should.be.eq(1);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('query Recipe to CSV with Date should be success. out of date', async (done) => {
    try {
      const query = { draw: '1',
        type: 'csv',
        startDate: '1900/1/1',
        endDate: '1901/1/1',
        columns:[
           { data: 'id', name: '' },
           { data: 'perfumeName', name: '', "searchable": "true"},
           { data: 'authorName', name: '' , "searchable": "true"},
           { data: 'createdAt', name: '', "searchable": "false"},
           { data: 'updatedAt', name: '', "searchable": "false"},
           { data: 'visibility', name: '', "searchable": "false"},
           { data: 'productionStatus', name: '', "searchable": "false"},
           { data: 'description', name: '', "searchable": "false"},
           { data: 'message', name: '', "searchable": "false"},
           { data: 'formula', name: '', "searchable": "false"},
        ],
        order: [ { column: '0', dir: 'asc' } ],
        search: { value: 'John', regex: 'false' },
        _: '1470989140227'
      }
      const result = await ExportService.query({query, modelName: 'recipe'});
      result.length.should.be.eq(0);
      done();
    } catch (e) {
      done(e);
    }
  });


  it('export Recipe to CSV with Date should be success.', async (done) => {
    try {
      const json = [
        {
          "formula": [
            {
              "drops": "1",
              "scent": "BA69",
              "color": "#E87728"
            },
            {
              "drops": "2",
              "scent": "BA70",
              "color": "#B35721"
            }
          ],
          "formulaTotalDrops": 3,
          "authorFbPage": "https://www.facebook.com/LabFnP",
          "message": "this is love test",
          "description": "",
          "coverPhoto": "/assets/labfnp/img/recipe-default-cover.1.jpg",
          "visibilityDesc": "非公開",
          "productionStatusDesc": "NEW",
          "updatedAt": "2016/09/20 18:08:00",
          "createdAt": "2016/09/20 18:08:00",
          "createdAtIso": "2016-09-20T10:08:59.000Z",
          "updatedAtIso": "2016-09-20T10:08:59.000Z",
          "id": 1,
          "formulaLogs": "",
          "authorName": "王大明",
          "perfumeName": "John test perfume",
          "createdBy": "scent",
          "totalDrops": 0,
          "visibility": "PRIVATE",
          "productionStatus": "NEW",
          "UserId": 2,
          "coverPhotoId": null
        }
      ]
      const result = await ExportService.export({ json });
      sails.log.debug(result);
      done();
    } catch (e) {
      done(e);
    }
  });

});
