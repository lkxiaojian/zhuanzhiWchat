const util = require('../../utils/util.js')
var typeId = 0;
Page({
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
    pdfPath: "",
    timeEnd: "",
    fRelated: [],
    lRelated: {},
  },

  onLoad: function(options) {
    var that = this;
    // var articleId = 289;
    var articleId = options.articleId
    this.setData({
      articleKeyWord: options.articleKeyWord,
      articleIds: options.articleId,
      articleContentType: options.contentType,
      stateType: options.stateType
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
        // state: options.stateType,
        state: 1,
        wechatid: getApp().globalData.wxId
      },
      method: 'GET',
      success: function(res) {
        var author = false;
        // if (res.data.result.content_manual) {
        //   WxParse.wxParse('detailHtml', 'html', res.data.result.content_manual, that, 0);
        // }
        if (res.data.result.author && res.data.result.author.length > 0) {
          author = true;
        }
        res.data.result.create_time = util.toDate(res.data.result.create_time);
        res.data.result.article_keyword = getApp().handleKeyWord(res.data.result.article_keyword);
        that.setData({
          result: res.data.result,
          fRelated: res.data.result.related.slice(0, res.data.result.related.length - 1),
          lRelated: res.data.result.related[res.data.result.related.length - 1],
          pdfPath: res.data.result.pdf_path,
          author: author
        })
        wx.hideLoading();
      },
    })
  },
  ckwx: function() {
    wx.navigateTo({
      url: '../ckwx/ckwx?articleId=' + this.data.articleIds + '&stateType=' + this.data.stateType
    })
  },
  fxShare: function() {
    this.onShareAppMessage();
  },

  lookImg: function() {
    var results = this.data.result
    wx.navigateTo({
      url: '../lookImg/lookImg?imgContent=' + results.image_path + '&articleId=' + this.data.articleIds + '&stateType=' + this.data.stateType
    })
  },
  lookPdf: function() {
    var that = this;
    const pdfUrl = getApp().globalData.imageUrl + that.data.pdfPath
    wx.downloadFile({
      url: pdfUrl,
      // url:'https://xiaochengxu.zhuanzhilink.com/weixin_img/resources/pdf/paper/2019-03-28_46/%E5%9F%BA%E4%BA%8E2%E7%BB%B4%E6%BF%80%E5%85%89%E9%9B%B7%E8%BE%BE%E7%9A%84%E5%B0%8F%E5%9E%8B%E5%9C%B0%E9%9D%A2%E7%A7%BB%E5%8A%A8%E6%9C%BA%E5%99%A8%E4%BA%BA%E8%87%AA%E4%B8%BB%E5%9B%9E%E6%94%B6%E6%96%B9%E6%B3%95.pdf',
      success: function(res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function(res) {},
        })
      }
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
    var articleId = this.data.articleIds;
    var articleTypeId = this.data.result.article_type_id
    // 统计用户停留时间
    wx.request({
      url: getApp().globalData.baseUrl + '/statistics/insertStatisticsInfo/rest', //仅为示例，并非真实的接口地址
      data: {
        articleId: articleId,
        userId: getApp().globalData.wxId,
        articleType: articleTypeId,
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
    var articleId = this.data.articleIds;
    let wechatid = this.data.wechatid;
    // let states = this.data.stateType;
    let states = 1;
    wx.request({
      url: getApp().globalData.baseUrl + '/statistics/insertStatisticsInfo/rest', //仅为示例，并非真实的接口地址
      data: {
        articleId: articleId,
        userId: getApp().globalData.wxId,
        articleType: that.data.result.article_type_id,
        statisticsType: 2,
        countNum: 1,
      },
      method: "GET",
      success(res) {
      }
    })
    return {
      title: that.data.result.article_title,
      path: 'pages/paper/paper?articleId=' + articleId  + '&typeId=1',
      success: function () {
        // 转发成功  
        that.updateStatus(2, "share");
        // 统计用户转发时间
      },
      fail: function (res) {
        // 转发失败  
      },
      complete: function () {
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
  // var id = data.currentTarget.dataset.id;
  // var articleKeyWord = data.currentTarget.dataset.name;
  // var contentType = data.currentTarget.dataset.type;
  // var stateType = data.currentTarget.dataset.postid;
  // url: '../paper/paper?articleId=' + id + '&articleKeyWord=' + articleKeyWord + '&contentType=' + contentType + '&stateType=' + stateType,
  selectDetail: function(data) {
    wx.showLoading({
      title: '跳转中',
    })
    var id = data.currentTarget.dataset.id;
    // var contentType = this.data.articleContentType;
    // var stateType = this.data.stateType;
    var contentType = data.currentTarget.dataset.type;
    var stateType = data.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../paper/paper?articleId=' + id + '&contentType=' + contentType + '&stateType=' + stateType,
      complete: function() {
        wx.hideLoading()
      }
    })
  },
})