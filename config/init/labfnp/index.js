
const ScentNoteData = require('./data/ScentNote');
const ScentData = require('./data/Scent');
const ScentDetail = require('./data/ScentDetail.json');
const FeelingData = require('./data/Feeling');

module.exports.init = async () => {
  try {
    const {environment} = sails.config;
    console.log('>>>> config/init/labfnp >>>>');



    let newMenuItems = [
      { icon: 'home', href: '/admin/dashboard', title: '控制台', sequence: 0},
      { icon: 'wrench', href: '#', title: '資料維護', sequence: 1},
      { icon: 'puzzle-piece', href: '#', title: '實驗室', sequence: 2},

      { href: '/admin/user', title: '會員資料', sequence: 20, ParentMenuItemId: 2},
      { href: '/admin/post', title: '內容資料', sequence: 30, ParentMenuItemId: 2},
      { href: '/admin/labfnp/recipe', title: '配方資料', sequence: 40, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scent', title: '香味分子', sequence: 50, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scentnote', title: '香調', sequence: 60, ParentMenuItemId: 2},
      { href: '/admin/labfnp/feeling', title: '感覺', sequence: 70, ParentMenuItemId: 2},
      { href: '/admin/slogan', title: '口號', sequence: 80, ParentMenuItemId: 2},
      { href: '/admin/allpay', title: '訂單', sequence: 90, ParentMenuItemId: 2},
      { href: '/admin/message', title: '訊息', sequence: 100, ParentMenuItemId: 2},

      { href: '/admin/mock', title: '隨機資料表', sequence: 20, ParentMenuItemId: 3}

    ]

    let title = newMenuItems.map(item => item.title)
    let findMenuItems = await MenuItem.findAll({where:{title}})
    let findTitle = findMenuItems.map(item => item.title)



    let createMenuItems = title.reduce((result, title, index) => {
      if(findTitle.indexOf(title) == -1){
        result.push(newMenuItems[index])
        return result
      }
      return result
    }, [])


    await MenuItem.bulkCreate(createMenuItems);

    if (environment == 'production') return ;

    ScentDetail.rows.forEach(function(scentDetail){
      Scent.create({
        sequence: parseInt(scentDetail.name.replace(/[^0-9]+/, '')),
        name: scentDetail.name,
        title: scentDetail.title,
        description: scentDetail.description,
      })
    });

    Feeling.bulkCreate(FeelingData.rows).then(() => {
      ScentNoteData.rows.forEach(function(row) {
        ScentNote.create(row).then(function(scentNote) {

          ScentData.rows.forEach(function(row) {
            if (row.scentNote == scentNote.title) {
              row.scents.forEach(function(scentName) {
                Scent.findOne({
                  where: {
                    name: scentName,
                  }
                }).then(function(scent) {
                  if (scent) {

                    Feeling.findAll({where: {scentName: scentName}}).then((feelings) => {

                      feelings = feelings.map((feeling) => {
                        const key = feeling.title
                        const value = feeling.score
                        return {key, value}
                      })

                      scent.ScentNoteId = scentNote.id;
                      scent.feelings = feelings
                      scent.save();
                    })
                  }
                });
              })
            }
          });

        });
      });

    })


    const feeling = {
      title: '花香',
      scentName: 'BT99',
      totalRepeat: 4,
      score: 10,
    };
    await Feeling.create(feeling);


    await Post.create({
      title: '自造者世代（MAKERS）與第三次工業革命',
      content: '<p class="lead">自造者世代的興起源自於網路、科技的進步與每個人渴望參與創造的特質，人們開始了解到知識的傳遞與以開放的內心學習不同知識、跨領域的結合之重要性。</p><p>因此近年開展出了，被稱為『第三次工業革命的機會』，則是一個新的工業化思維，並闡述人們開始從原來產品的使用者轉為產品的設計者，且發現到實際上自己參與實作並沒那麼難。讓過去被認為是所謂的休閒嗜好之活動，反而創造出原本不被想像的價值，以打破過去工業化時代大量化製造的障礙，以群募得方式找到某一特定群體所關注的議題，並實現此群體共同的想像。</p><blockquote>『第三次工業革命的機會』，這會是我們大家的機會，一個群體共創價值的時代，不僅只是透過3D printer此類型工具做表象上的改變，同時更是在每個人的思維上都增添了不同創作力的想像！</blockquote>',
      coverType: 'video',
      coverUrl: 'https://www.youtube.com/embed/VREirE8afgg',
      url: 'http://localhost:5001/blog/flower',
      abstract: '自造者世代的興起源自於網路、科技的進步與每個人渴望參與創造的特質，人們開始了解到知識的傳遞與以開放的內心學習不同知識、跨領域的結合之重要性。',
      UserId: 1,
    });

    const image = await Image.create({
      filePath: 'http://www.labfnp.com/modules/core/img/update1.jpg',
      type: 'image/jpeg',
      storage: 'url',
    });

    const post = await Post.create({
      title: '香味的一沙一世界5',
      content: '<p>我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨，聞到的則是這『一朵康乃馨的味道』，而事實上，若深入去探究此康乃馨的氣味組成，則可小到香味分子的程度：花香由多種香味分子所組成。而這樣的組成就像香水、香料以及香味分子的不同級距來看，香水聞起來是一種味道而細究卻是多種香味分子的組成。</p><p>或許你會以為我們跟台北火車站、天水街的化工行在做一樣的，但實際上，於過去台灣可以找到的香味素材，大多皆已被調好的香精，而這些香精的比例對於供應商來說時常被視為商業機密，所以當你選用了某一供應商所調製的香精時很難了解到其內容組成，而為了調出一樣的味道，你只能持續的跟他買香精、香料。這樣的環境下，對於調香創作的自由度與香味分子本質掌握、認識的程度就會變得非常的低，而LFP秉持著期望每個創作者都可以實際了解香味分子的感受，才能從本質上自主選擇。</p>',
      cover: image.id,
      url: 'http://localhost:5001/blog/flower',
      abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨，聞到的則是這『一朵康乃馨的味道』，而事實上，若深入去探究此康乃馨的氣味組成，則可小到香味分子的程度：花香由多種香味分子所組成。而這樣的組成就像香水、香料以及香味分子的不同級距來看，香水聞起來是一種味道而細究卻是多種香味分子的組成',
      UserId: 1,
    });

    const tag = await Tag.create({
      title: '花'
    });

    await post.addTag(tag.id);

    const recipeLove = {
      formula:[
        {"drops":"1","scent":"T12","color":"#E87728"},
        {"drops":"2","scent":"BA70","color":"#B35721"},
        {"drops":"3","scent":"T25","color":"#B35721"},
        {"drops":"4","scent":"BU2","color":"#B35721"},
        {"drops":"5","scent":"T4","color":"#B35721"},
        {"drops":"6","scent":"B13","color":"#B35721"}
      ],
      formulaLogs: '',
      authorName: '王大明',
      perfumeName: 'love',
      description: 'this is love',
      message: '備註',
      UserId: 1,
    }
    Recipe.create(recipeLove);

    const recipeLoveAgain = {
      formula:[
        {"drops":"1","scent":"BA69","color":"#E87728"},
        {"drops":"2","scent":"BA70","color":"#B35721"}
      ],
      visibility: "PUBLIC" ,
      formulaLogs: '',
      authorName: '王大明',
      perfumeName: 'love again',
      description: 'this is love again',
      message: '備註',
      UserId: 1,
    };

    let testRecipe = await Recipe.create(recipeLoveAgain);

    //建立一筆 Allpay 資料，使用上方 testRecipe資料
    let recipeOrder = await RecipeOrder.create({
      remark: '123',
      UserId: 1,
      RecipeId: testRecipe.id,
    });
    let data = {
      relatedKeyValue: {
        //RecipeId: recipe.id,
        RecipeOrderId: recipeOrder.id,
      },
      "TradeNo": "1608301610017019",
      "MerchantTradeNo": "57feb73f",
      "RtnCode": 1,
      "RtnMsg": "付款成功",
      "PaymentDate": "2016-08-30 16:11:59",
      "TradeDate": "2016-08-30 16:10:21",
      "PaymentType": "ATM_TAISHIN",
      "ShouldTradeAmt": 999,
      "TradeAmt": 999,
      "BankCode": "812",
      "vAccount": "9966627013152469",
      "ExpireDate": "2016/09/02",
      "PaymentNo": null,
      "Barcode1": null,
      "Barcode2": null,
      "Barcode3": null,
      "CheckMacValue": null,
      "MerchantTradeDate": null,
      "RecipeOrderId": recipeOrder.id,
    }
    await Allpay.create(data);

    recipeOrder = await RecipeOrder.create({
      remark: '456',
      UserId: 1,
      RecipeId: testRecipe.id,
    });

    data = {
      relatedKeyValue: {
        //RecipeId: recipe.id,
        RecipeOrderId: recipeOrder.id,
      },
      "TradeNo": "1608301605202918",
      "MerchantTradeNo": "301ea83b",
      "RtnCode": 1,
      "RtnMsg": "交易成功",
      "PaymentDate": "2016-08-30 16:07:23",
      "TradeDate": null,
      "PaymentType": "Credit_CreditCard",
      "ShouldTradeAmt": null,
      "TradeAmt": 999,
      "BankCode": null,
      "vAccount": null,
      "ExpireDate": null,
      "PaymentNo": null,
      "Barcode1": null,
      "Barcode2": null,
      "Barcode3": null,
      "CheckMacValue": null,
      "MerchantTradeDate": null,
      "RecipeOrderId": recipeOrder.id,
    }
    await Allpay.create(data);

    // == Message ==
    let order = {
      serialNumber: 'test',
      User: {
        username: 'testUser',
        email: 'smlsun@gmail.com'
      }
    }
    let messageConfig = await MessageService.paymentConfirm(order);
    let message = await Message.create(messageConfig);
    await MessageService.sendMail(message);
    // == Message done. ==




  } catch (e) {
    console.error(e);
  }
};
