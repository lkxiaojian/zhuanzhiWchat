// pages/lookPdf/lookPdf.js
Page({
  data: {
    pdfContent: "",
    pdfTime: "",
    pdfTitle: "",
  },

  onLoad: function(options) {
    var that = this;
    this.setData({
      pdfContent: options.pdfContent,
      pdfTime: options.pdfTime,
      pdfTitle: options.pdfTitle,
    })
    wx.downloadFile({
      url: 'http://106.2.11.94:7902/resources/pdf/paper/2019-03-12_96/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%CF%A2%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDSLAM%CD%BC%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD.pdf',
      success: function(res) {
        var taht = this;
        var Path = res.tempFilePath
        //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
            filePath: Path,
            success: function(res) {}
          }),
          console.log(filePath, 'ghbjknm.')
      },
      fail: function(res) {}
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