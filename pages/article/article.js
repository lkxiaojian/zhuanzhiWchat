var imagUrl = getApp().globalData.imageUrl
var sharetypeId = 0;
var typeName = '';
Page({
  data: {
    isHideNoMore: false,
    typeName: "",
    typeId: "",
    page: 0,
    arcticleList: [],
    imagUrl: getApp().globalData.imageUrl,
    navH: getApp().globalData.navHeight,
    imageBack: "",
    articleNum: "",
    paperCount: "",
  },
  onLoad: function(options) {
    sharetypeId = options.sharetypeId;
    this.setData({
      typeName: options.typeName.replace(/,/g, ''),
      typeId: options.typeId,
    });
    this.requestData();
  },
  onPullDownRefresh: function() {
    this.data.page = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //刷新数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.page++;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //加载数据
  },
  requestData: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/trait/rest',
      data: {
        articleId: that.data.typeId,
        page: that.data.page
      },
      method: "GET",
      success: function(res) {
        that.setData({
          paperCount: res.data.articleNum,
          articleNum: res.data.paperCount,
        });
        var article = res.data.result;
        if (article.length > 0) { //是不是为空
          for (var i = 0; i < article.length; i++) {
            var art = article[i];
            art.article_keyword = getApp().handleKeyWord(art.article_keyword);
          }
          var backUrl = article[0].iamge_back;
          if (that.data.page == 0) { //是不是第一页
            that.setData({
              arcticleList: article,
              isHideNoMore: false,
              imageBack: imagUrl + backUrl
            })
          } else {
            that.setData({
              arcticleList: that.data.arcticleList.concat(article),
              isHideNoMore: false,
              imageBack: imagUrl + backUrl
            })
          }
        } else {
          that.setData({
            isHideNoMore: true,
          })
        }
      },
      fail: function() {},
      complete: function() {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },
  selectDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var contentType = e.currentTarget.dataset.type;
    var stateType = e.currentTarget.dataset.postid;
    if (contentType == 0 || contentType == 1) {
      wx.navigateTo({
        url: '../detail/detail?articleId=' + id + '&contentType=' + contentType + '&stateType=' + stateType,
        complete: function() {
          wx.hideLoading()
        }
      })
    } else if (contentType == 2) {
      wx.navigateTo({
        url: '../paper/paper?articleId=' + id + '&contentType=' + contentType + '&stateType=' + stateType,
        complete: function() {
          wx.hideLoading()
        }
      })
    }
  },
  back: function() {
    if (sharetypeId == 1) {
      wx.redirectTo({
        url: '../welcome/welcome',
      });

    } else {
      wx.navigateBack();
    }
  },
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '专知',
      path: 'pages/article/article?sharetypeId=1&typeId=' + that.data.typeId + '&typeName=' + that.data.typeName,
      success: function(shareTickets) {},
      fail: function(res) {},
      complete: function() {}
    }
  },
})