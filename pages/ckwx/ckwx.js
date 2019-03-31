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
  onReady: function() {

  },

  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})