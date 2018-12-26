// pages/special/special.js
var sharetypeId=0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    articleTypes: [],
    imageUrl: getApp().globalData.imageUrl,
    navH: getApp().globalData.navHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    sharetypeId = options.sharetypeId;
    var keyword = options.keyword;
    console.log(keyword);
    var that = this;
    var tar = this.cleanSpelChar(options.item)
    let item = JSON.parse(tar);
    that.data.articleTypes=item;
    if(item.length>0){
      for(var i=0;i<item.length;i++){
        item[i].article_type_names = that.hilight_word(keyword, item[i].article_type_name);
        item[i].article_keyword = getApp().handleKeyWord(item[i].article_keyword);
      }
    }
    console.log(item);
     this.setData({
          articleTypes: item,
      })
  },
  hilight_word: function (key, word) {
    let idx = word.indexOf(key), t = [];
    if (idx > -1) {
      if (idx == 0) {
        t = this.hilight_word(key, word.substr(key.length));
        t.unshift({ key: true, str: key });
        return t;
      }

      if (idx > 0) {
        t = this.hilight_word(key, word.substr(idx));
        t.unshift({ key: false, str: word.substring(0, idx) });
        return t;
      }
    }
    return [{ key: false, str: word }];
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: '专知',
      path: 'pages/searchSpecial/searchSpecial?sharetypeId=1',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功  
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败  
      },
      complete: function () {
        // 不管成功失败都会执行  
        console.log(res);
      }
    }

  },
  back: function () {
    console.log('返回上级目录');
    if (sharetypeId == 1) {
      wx.redirectTo({
        url: '../welcome/welcome',
      });

    }else{
      wx.navigateBack();
    }

   
  },
  dingyue: function (e) {
    var that = this;
    var app = getApp();
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
      data: {
        wechatid: app.globalData.wxId,
        attentions: that.data.articleTypes[index].article_type_id
      },
      method: "GET",
      success(res) {
        if (res.data.code == 0) {
          that.data.articleTypes[index].type_id = 1;
          that.setData(that.data);
        }
      }
    })
  },
  cleanSpelChar: function (localData) {
    var goodChar = "~!@#$%^&*()_+-=`[]{};':\"\\|,./<>?\n\r";
    var noiseChar = "～！＠＃＄％＾＆＊（）＿＋－＝｀［］｛｝；＇：＂＼｜，．／＜＞？　　";
    for (var i = 0; i < goodChar.length; i++) {
      var oneChar = goodChar.charAt(i);
      var towChar = noiseChar.charAt(i)
      while (localData.indexOf(towChar) >= 0) {
        localData = localData.replace(towChar, oneChar)
      }
    }
    return localData;

  },
  quxiao: function (e) {
    var app = getApp();
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
      data: {
        wechatid: app.globalData.wxId,
        attentions: that.data.articleTypes[index].article_type_id,
        type: 1
      },
      method: "GET",
      success(res) {
        if (res.data.code == 0) {
          that.data.articleTypes[index].type_id = 2;
          that.setData(that.data);
        }
      }
    })
  },
  selectAll: function (e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
    })
  }
})