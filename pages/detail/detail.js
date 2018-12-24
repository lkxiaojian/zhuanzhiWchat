// pages/detail/detail.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    result: null,
    imageUrl: getApp().globalData.imageUrl,
    navH: getApp().globalData.navHeight,
    author:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var articleId = options.articleId;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/message/rest',
      data: {
        articleId: articleId,
        wechatid: getApp().globalData.wxId
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data.result);
        console.log(res.data.result.author);
        var author = false;
        if(res.data.result.content_manual){
        WxParse.wxParse('detailHtml', 'html', res.data.result.content_manual, that, 0);
        }
        //WxParse.wxParse('detailHtml', 'html', res.data.result.details_div, that, 0);
        if(res.data.result.author && res.data.result.author.length>0){
          author = true;
        }
        console.log(author);
        res.data.result.create_time = util.toDate(res.data.result.create_time);
        that.setData({
          result: res.data.result,
          author:author
        })
      },
    })
  },
  share:function(){
    this.onShareAppMessage();
  },
  love:function(){
    if(this.data.result.collect_state==1){
      this.updateStatus(3,"collect");
    }else{
      this.updateStatus(2,"collect");
    }

   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log("转发");
    var that = this;
    return {
      title: that.data.result.article_title,
      path: 'pages/detail/detail?articleId=' + that.data.result.article_id,
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功  
        that.updateStatus(2,"share");
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败  
      },
      complete: function () {
        // 不管成功失败都会执行  
        console.log(res);
      }
    }
  },
  back:function(){
    wx.navigateBack({
      changed: true,
    })
  },
  updateStatus:function(type,flag){
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl +'/article/collectingAndShare/rest',
      data: {
        wechat_id: getApp().globalData.wxId,
        type: type,
        article_id: that.data.result.article_id,
        article_type_id: that.data.result.article_type_id
      },
      success: function(res) {
        console.log(type+flag);
        if(type==2){
          if("collect"==flag){
            that.toast("取消收藏成功！");
            that.data.result.collect_state = 1;
            that.setData(that.data);
          }else{
            that.toast("分享成功！");
          } 
        }else{
          that.toast("收藏成功！");
          that.data.result.collect_state=0;
          that.setData(that.data);
        }
      }
    })
  },
  toast:function(msg){
    wx.showToast({
      title: msg,
      mask: true,
    })
  },
  selectDetail: function (data) {
    wx.showLoading({
      title: '跳转中',
    })
    var id = data.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?articleId=' + id,
      complete: function () {
        wx.hideLoading()
      }
    })
  },
})
