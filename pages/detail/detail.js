// pages/detail/detail.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    result:null,
    imageUrl:getApp().globalData.imageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var articleId = options.articleId;
      wx.request({
        url: getApp().globalData.baseUrl +'/article/message/rest',
        data: {
          articleId: articleId,
          wechatid:getApp().globalData.wxId
        },
        method: 'GET',
        success: function(res) {
          console.log(res);
          if (res.data.result.content_type==1){
            WxParse.wxParse('detailHtml', 'html', res.data.result.content_crawl, that, 0);
           // res.data.result.create_time = util.formatTime(res.data.result.create_time);
          }else{
            WxParse.wxParse('detailHtml', 'html', res.data.result.details_div, that, 0);
          }
          that.setData({
            result :res.data.result
          })
        },
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})