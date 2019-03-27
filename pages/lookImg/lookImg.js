// pages/lookImg/lookImg.js
Page({
  data: {
    imgContent: "",
    imgTime: "",
    imgTitle: "",
  },
  onLoad: function(options) {
    this.setData({
      imgContent: options.imgContent.split(','),
      imgTime: options.imgTime,
      imgTitle: options.imgTitle,
    })
  },
  onReady: function() {},

  onShow: function() {

  },

  onHide: function() {

  },

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