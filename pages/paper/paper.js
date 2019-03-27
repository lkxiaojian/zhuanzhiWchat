// pages/detail/detail.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
var typeId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    imageUrl: getApp().globalData.imageUrl,
    navH: getApp().globalData.navHeight,
    author: false,
    articleIds: "",
    articleId: "",
    articleKeyWord: "",
    nowTime: "",
    timeStart: "",
    contentType: 0,
    timeEnd: "",
  },

  onLoad: function(options) {
    var that = this;
    // var articleId = 289;
    var articleId = options.articleId
    this.setData({
      articleKeyWord: options.articleKeyWord,
      articleIds: options.articleId,
      articleContentType: options.contentType,
    })
    typeId = options.typeId;
    wx.showLoading({
      title: "加载......",
      mask: false,
    });
    wx.request({
      url: getApp().globalData.baseUrl + '/article/message/rest',
      data: {
        articleId: articleId,
        state: options.contentType,
        wechatid: getApp().globalData.wxId
      },
      method: 'GET',
      success: function(res) {
        var author = false;
        if (res.data.result.content_manual) {
          WxParse.wxParse('detailHtml', 'html', res.data.result.content_manual, that, 0);
        }
        if (res.data.result.author && res.data.result.author.length > 0) {
          author = true;
        }
        res.data.result.create_time = util.toDate(res.data.result.create_time);
        res.data.result.article_keyword = getApp().handleKeyWord(res.data.result.article_keyword);
        that.setData({
          result: res.data.result,
          author: author
        })

        wx.hideLoading();
      },
    })
  },
  fxShare: function() {
    this.onShareAppMessage();
  },
  ckwx: function() {
    var results = this.data.results
    wx.navigateTo({
      url: '../ckwx/ckwx?ckwxUrl = ' + results.reference + '&ckwxTime=' + results.paper_create_time + '&ckwxTitle=' + results.article_title
    })

  },
  lookImg: function() {
    var results = this.data.results
    wx.navigateTo({
      url: '../lookImg/lookImg?imgContent = ' + results.image_back + '&imgTime=' + results.paper_create_time + '&imgTitle=' + results.article_title

    })
  },
  lookPdf: function() {
    var results = this.data.results
    wx.navigateTo({
      url: '../lookPdf/lookPdf?pdfContent = ' + results.pdf_path + '&pdfTime=' + results.paper_create_time + '&pdfTitle=' + results.article_title
    })
  },
  love: function() {
    if (this.data.result.collect_state == 1) {
      this.updateStatus(3, "collect");
    } else {
      this.updateStatus(2, "collect");
    }
  },
  onShow() {
    this.setData({
      timeStart: Date.parse(new Date())
    })
  },
  onHide() {
    var that = this
    this.setData({
      timeEnd: Date.parse(new Date())
    })
    var time = this.data.timeEnd - this.data.timeStart;
    var articleId = this.data.articleIds
    var articleKeyWord = this.data.articleKeyWord
    // 统计用户停留时间
    wx.request({
      url: getApp().globalData.baseUrl + '/statistics/insertStatisticsInfo/rest', //仅为示例，并非真实的接口地址
      data: {
        articleId: articleId,
        userId: getApp().globalData.wxId,
        articleType: articleKeyWord,
        statisticsType: 3,
        countNum: time,
      },
      method: "GET",
      success(res) {}
    })
  },
  onUnload() {
    this.onHide()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var articleId = this.data.articleId;
    var articleKeyWord = this.data.articleKeyWord;
    return {
      title: that.data.result.article_title,
      path: 'pages/detail/detail?articleId=' + that.data.result.article_id + '&typeId=1',
      success: function(shareTickets) {
        // 转发成功  
        that.updateStatus(2, "share");
        // 统计用户停留时间
        wx.request({
          url: getApp().globalData.baseUrl + '/statistics/insertStatisticsInfo/rest', //仅为示例，并非真实的接口地址
          data: {
            articleId: articleId,
            userId: getApp().globalData.wxId,
            articleType: articleKeyWord,
            statisticsType: 2,
            countNum: 1
          },
          method: "GET",
          success(res) {}
        })
      },
      fail: function(res) {
        // 转发失败  
      },
      complete: function() {
        // 不管成功失败都会执行  
      }
    }
  },
  back: function() {
    if (typeId == 1) {
      wx.redirectTo({
        url: '../welcome/welcome',
      });

    } else {
      wx.navigateBack({
        changed: true,
      })
    }
  },
  updateStatus: function(type, flag) {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/collectingAndShare/rest',
      data: {
        wechat_id: getApp().globalData.wxId,
        type: type,
        article_id: that.data.result.article_id,
        article_type_id: that.data.result.article_type_id
      },
      success: function(res) {
        if (type == 2) {
          if ("collect" == flag) {
            that.toast("取消收藏成功！");
            that.data.result.collect_state = 1;
            that.setData(that.data);
          } else {
            that.toast("分享成功！");
          }
        } else {
          that.toast("收藏成功！");
          that.data.result.collect_state = 0;
          that.setData(that.data);
        }
      }
    })
  },
  toast: function(msg) {
    wx.showToast({
      title: msg,
      mask: true,
    })
  },
  selectDetail: function(data) {
    wx.showLoading({
      title: '跳转中',
    })
    var id = data.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?articleId=' + id,
      complete: function() {
        wx.hideLoading()
      }
    })
  },
})