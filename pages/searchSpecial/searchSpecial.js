// pages/special/special.js
var sharetypeId=0;
var messageItem='';
var keyword='';
Page({
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    articleTypes: [],
    imageUrl: getApp().globalData.imageUrl,
    navH: getApp().globalData.navHeight,
    articleTypeList:[],
  },
  onLoad: function (options) {
    console.log(options,'dfdf')
    sharetypeId = options.sharetypeId;
    keyword = options.keyword;
    var that = this;
    // messageItem=options.item;
    // var tar = this.cleanSpelChar(messageItem);
    // let item = JSON.parse(tar);
    // that.data.articleTypes = item;
   
    wx.request({
      url: getApp().globalData.baseUrl + '/article/search/rest', //仅为示例，并非真实的接口地址
      data: {
        wechatid: getApp().globalData.wxId,
        message: options.item,
        page: 0
      },
      method: "GET",
      success(res) {
        if (res.data.code == 0) {
          let item = res.data.articleType;
          that.data.articleTypes = item;
          if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
              let pattern = /[\u3002|\uff0c]/;
              let nameS = item[i].article_type_name
              let typeNameS = pattern.test(nameS) ? nameS: nameS.replace(/,/g, '')
              item[i].article_type_names = that.hilight_word(keyword, typeNameS);
              item[i].article_type_keyword = getApp().handleKeyWord(item[i].article_type_keyword);
            }
          }
          that.setData({
            articleTypes: item,
          })
        }
      }
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
  onShareAppMessage: function () {
    return {
      title: '专知',
      path: `/pages/searchSpecial/searchSpecial?sharetypeId=1&item=${messageItem}&keyword=${keyword}`,
    }

  },
  back: function () {
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