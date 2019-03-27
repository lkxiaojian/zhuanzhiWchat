// pages/ckwx/ckwx.js
Page({
  data: {
    ckwxUrl: "",
    ckwxTime: "",
    ckwxTitle: "",
  },

  onLoad: function(options) {
    this.setData({
      ckwxUrl: options.ckwxUrl,
      ckwxTime: options.ckwxTime,
      ckwxTitle: options.ckwxTitle,
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