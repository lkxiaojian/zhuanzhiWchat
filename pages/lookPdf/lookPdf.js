// pages/lookPdf/lookPdf.js
Page({
  data: {
    pdfContent: "",
    pdfTime: "",
    pdfTitle: "",
    filePath:"",
    url:"",
  },
  onLoad: function(options) {
    var that = this;
    // this.setData({
    //   pdfContent: options.pdfContent,
    //   pdfTime: options.pdfTime,
    //   pdfTitle: options.pdfTitle,
    // })
    wx.downloadFile({
      url: 'http://106.2.11.94:7902/resources/pdf/paper/2019-03-12_96/%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%CF%A2%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDSLAM%CD%BC%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD.pdf',
      success(res) {
        that.setData({
          filePath:res.tempFilePath
        })
        // const filePath = res.tempFilePath
        // wx.openDocument({
        //   filePath:filePath,
        //   fileType: 'pdf',
        //   success(res) {
        //   }
        // })
      }
    })
  },

  onReady: function() {

  },

  onShareAppMessage: function() {

  }
})