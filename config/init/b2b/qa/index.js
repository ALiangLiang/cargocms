module.exports.init = async () => {
  try {
    sails.log("init QA!!!!!!!!!!!!!!!!!")
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {

      const post = await Post.create({
        title: '會員常見問題',
        content: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨',
        abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材',
        type: 'internal-event'
      });

      await Event.create({
        title: '該如何加入會員呢？',
        description: '您可先將欲購買的商品放進購物車開始結帳並選擇付款方式後，頁面右邊即會顯示「第一次購物」按此輸入基本資料即可完成購物，並填妥您的訂購人資訊，確定送出！訂單成立後，系統將會自動為您加入會員哦！',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '忘記密碼怎麼辦？',
        description: '若您忘記密碼，請點選「會員登入」後，請您先點選「忘記密碼」 再輸入註冊的電子郵件，系統即會自動將密碼重設通知寄至您預設的Email信箱中，請您收取郵件並點擊內文中的連結進行密碼重設即可。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });
      await Event.create({
        title: '忘記第一次購物時所填寫的E-mail信箱？',
        description: '煩請直接與客服中心聯繫。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });


      const post2 = await Post.create({
        title: '購物常見問題',
        content: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材（ex:玫瑰、康乃馨..等)所組成的『這束花的味道』，接著抽出其中的一朵康乃馨',
        abstract: '我們可以這樣形容，當你手中捧到一束花時，可以聞到花束中的各種花材',
        type: 'internal-event'
      });

      await Event.create({
        title: '購物流程說明',
        description: `不需加入會員即可進行訂購，親切易懂的指引式流程畫面，讓您充分享受便利的購物樂趣。<br/>
第一次購物：選擇商品＞＞加入購物車＞＞結帳時請點選右邊"第一次購物"＞＞選擇結帳方式＞＞填寫正確會員資料＞＞ 完成購物<br/>
非第一次購物：選擇商品＞＞加入購物車＞＞輸入帳號密碼＞＞選擇結帳方式＞＞ 完成購物<br/>`,
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '如何查詢目前訂單的處理情況？',
        description: '請點選「會員登入」，輸入您的E-mail及密碼登入後，即可查詢該訂單的處理狀態。',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post2.id
      });
      await Event.create({
        title: '我想購買的商品已經缺貨，什麼時候會進貨呢？',
        description: '如購物車按鈕顯示「商品售完已絕版」即表示該商品已售完無法再補貨囉！',
        sellStartDate: '2017-04-17 00:00:00',
        sellEndDate: '2017-04-17 00:00:00',
        eventStartDate: '2017-04-17 00:00:00',
        eventEndDate: '2017-04-17 00:00:00',
        PostId: post.id
      });

      // done();

      const atm = await Post.create({
        title: '付款',
        content: '有哪些付款方式？',
        abstract: '有哪些付款方式？',
        alias: 'payment',
        type: 'internal-event'
      });

      await Event.create({
        title: '下完訂單後，我該如何付款？',
        description: '下訂單後，會在訂單資訊左下方顯示付款方式，請依照指示付款即可。',
        sellStartDate: '2017-01-01 00:00:00',
        sellEndDate: '2017-01-01 00:00:00',
        eventStartDate: '2017-01-01 00:00:00',
        eventEndDate: '2017-01-01 00:00:00',
        PostId: atm.id
      });
    }

  } catch (e) {
    console.error(e);
  }
};
