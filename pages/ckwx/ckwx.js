// pages/ckwx/ckwx.js
Page({
  data: {
    result: "",
  },
  onLoad: function(options) {
    var that = this;
    this.setData({
      articleIds: options.articleId,
      stateType: options.stateType
    })
    wx.request({
      url: getApp().globalData.baseUrl + '/article/message/rest',
      data: {
        articleId: options.articleId,
        state: options.stateType,
        wechatid: getApp().globalData.wxId
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          result: res.data.result,
        })
      },
    })
  },
  back: function() {
    wx.redirectTo({
      url: '../paper/paper?articleId=' + this.data.articleIds + '&stateType=' + this.data.stateType
    })
  },
})