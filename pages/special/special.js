// pages/special/special.js
var isFalg = false;
var sharetypeId = 0;
Page({
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    navH: getApp().globalData.navHeight,
    articleTypes: [],
    imageUrl: getApp().globalData.imageUrl,
    article_type_nameSp: [],
    page: 0,
  },
  onLoad: function(options) {
    var that = this;
    var a = [];
    sharetypeId = options.sharetypeId;
    this.requestData();
  },
  requestData: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/getalltype/rest',
      data: {
        wechatid: getApp().globalData.wxId,
        page: that.data.page
      },
      method: "GET",
      success: res => {
        var articleTypes = res.data.result;
        for (var i = 0; i < articleTypes.length; i++) {
          articleTypes[i].article_type_nameSp = articleTypes[i].article_type_name.replace(/,/g, '')
        }
        if (res.data.result.length > 0) {
          for (var i = 0; i < res.data.result.length; i++) {
            res.data.result[i].article_type_keyword = getApp().handleKeyWord(res.data.result[i].article_type_keyword);
          }
          if (that.data.page == 0) { //是不是第一页
            that.setData({
              articleTypes: articleTypes,
            })
          } else {
            that.setData({
              articleTypes: that.data.articleTypes.concat(res.data.result),
            })
          }
        }
      }
    })
  },
  onPullDownRefresh: function() {
    this.data.page = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //刷新数据
  },
  onReachBottom: function() {
    this.data.page++;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //加载数据
  },
  onShareAppMessage: function() {
    return {
      title: '专知',
      path: 'pages/special/special?sharetypeId=1',
      success: function(shareTickets) {
        // 转发成功  
      },
      fail: function(res) {
        // 转发失败  
      },
      complete: function() {
        // 不管成功失败都会执行  
      }
    }
  },
  back: function() {
    if (sharetypeId == 1) {
      wx.redirectTo({
        url: '../welcome/welcome',
      });

    } else if (isFalg) {
      wx.navigateTo({
        url: '../index/index'
      })

    } else {
      wx.navigateBack();
    }

  },
  dingyue: function(e) {
    var that = this;
    var app = getApp();
    isFalg = true;
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
  quxiao: function(e) {
    var app = getApp();
    var that = this;
    isFalg = true;
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
  selectAll: function(e) {
    var name =  encodeURIComponent(e.currentTarget.dataset.name);
    var id = e.currentTarget.dataset.id;
    var image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
    })
  }
})