// pages/lookImg/lookImg.js
Page({
  data: {
    imgContent: "",
  },
  onLoad: function(options) {
    // imgContent
    var that = this;
    this.setData({
      articleIds: options.articleId,
      stateType: options.stateType
    })
    var imgArrays = [];
    var imgArray = options.imgContent.split(',')
    imgArray.forEach(i => {
      var imgs = getApp().globalData.imgBackUrl + i
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
})