// pages/lookImg/lookImg.js
Page({
  data: {
    imgContent: "",
  },
  onLoad: function(options) {
    var that = this;
    this.setData({
      articleIds: options.articleId,
      stateType: options.stateType
    })
    var imgArrays = [];
    var imgArray = options.imgContent.split(',')
    imgArray.forEach(i => {
      var imgs = getApp().globalData.baseUrl + i
      imgArrays.push(imgs)
    })
    this.setData({
      imgContent: imgArrays,
    })
  },
  back: function () {
    wx.redirectTo({
      url: '../paper/paper?articleId=' + this.data.articleIds + '&stateType=' + this.data.stateType
    })
  },
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