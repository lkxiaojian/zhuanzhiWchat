//index.js
//获取应用实例
Page({
  data: {
    isHideNoMore: false,
    page: 0,
    article_type_name: "",
    hasDingYue: [],
    selected: [],
    arcticleList: [],
    arcticleType: [],
    imageUrl: "https://xiaochengxu.zhuanzhilink.com/weixin_img"
  },

  onLoad: function() {
    var app = getApp();
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      navH: app.globalData.navHeight
    })
    if (app.globalData.userInfo) {
      if (app.globalData.wxId) {
        this.requestData();
      }
    } else {
      app.getUserInfo();
      // if (app.globalData.wxId) {
      //   this.requestData();
      // }
      this.requestData();
    }

  },
  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function() { //下拉刷新
    this.data.page = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //刷新数据
  },
  onReachBottom: function() { //上拉加载更多
    this.data.page++;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //加载数据
  },
  selectAllSpecial: function() {
    wx.navigateTo({
      url: '../special/special'
    })
  },
  requestData: function() {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/user/getIndexMessage/rest',
      data: {
        wechatid: getApp().globalData.wxId,
        page: that.data.page
      },
      method: "GET",
      success: res => {
        if (res.data.code == 0) { //请求数据不为空
          var totalAll = [];
          var article = res.data.result.article;
          if (article && article.length > 0) { //是不是为空
            for (var i = 0; i < article.length; i++) {
              var art = article[i];
              var createTime = getApp().convertTime(art.update_time);
              art.create_time = createTime;
              art.article_keyword = getApp().handleKeyWord(art.article_keyword);
              totalAll.push({
                firstItem: art,
                page: 0,
                childItems: []
              });
            }
            if (that.data.page == 0) { //是不是第一页
              this.data.hasDingYue = res.data.result.attention;
              this.data.selected = res.data.result.article;
              for (var i = 0; i < this.data.hasDingYue.length; i++) {
                this.data.hasDingYue[i].article_type_nameTop = this.data.hasDingYue[i].article_type_name.split(',')[1]
                this.data.hasDingYue[i].article_type_nameBt = this.data.hasDingYue[i].article_type_name.split(',')[0]
              }
              this.data.arcticleList = totalAll;
              for (var i = 0; i < this.data.selected.length; i++) {
                this.data.arcticleList[i].firstItem.article_type_nameTop = this.data.selected[i].article_type_name.split(',')[0]

                this.data.arcticleList[i].firstItem.article_type_nameBt = this.data.selected[i].article_type_name.split(',')[1]
              }
            } else {
              this.data.arcticleList = that.data.arcticleList.concat(totalAll);
              this.data.isHideNoMore = false;
              this.data.selected = this.data.arcticleList;
              for (var i = 0; i < this.data.selected.length; i++) {
                this.data.arcticleList[i].firstItem.article_type_nameTop = this.data.selected[i].firstItem.article_type_name.split(',')[0]
                this.data.arcticleList[i].firstItem.article_type_nameBt = this.data.selected[i].firstItem.article_type_name.split(',')[1]
              }
            }
          } else {
            if (that.data.page == 0) { //是不是第一页
              this.data.hasDingYue = res.data.result.attention;
            }
            this.data.isHideNoMore = true;
          }
        } else {
          this.data.isHideNoMore = true;
        }
        // this.data.isHideNoMore = true;
        this.setData(this.data);
        wx.hideLoading();
      },
      complete: function() {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading();
      },
      fail: function() {
        //请求失败
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading();
      }

    });
  },
  toSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  zhankai: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: getApp().globalData.baseUrl + "/user/getIndexMessageLast/rest",
      data: {
        wechatid: getApp().globalData.wxId,
        article_type_id: this.data.arcticleList[index].firstItem.article_type_id,
        page: this.data.arcticleList[index].page,
        type: this.data.arcticleList[index].firstItem.type,
        time: this.data.arcticleList[index].firstItem.create_time,
        article_id: this.data.arcticleList[index].firstItem.article_id
      },
      method: 'GET',
      success: function(res) {
        var list = that.data.arcticleList;
        if (list[index].page == 0) {
          list[index].childItems = res.data.result.article;
        } else {
          list[index].childItems = list[index].childItems.concat(res.data.result.article);
        }
        list[index].firstItem.num_prods = res.data.result.count;
        list[index].page = list[index].page + 1;
        that.setData({
          arcticleList: list
        })
      },
    })
  },
  selectAll: function(e) {
    wx.showLoading({
      title: '跳转中',
    })
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  startType: function(data) {
    wx.showLoading({
      title: '跳转中',
    })
    var page = this;
    var index = data.currentTarget.dataset['index'];
    var item = page.data.arcticleList[index].firstItem;
    var name = item.article_type_name;
    var id = item.article_type_id;
    var image = item.iamge_back;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  selectDetail: function(data) {
    console.log(data,'f hvgjbkn')
    wx.showLoading({
      title: '跳转中',
    })
    var id = data.currentTarget.dataset.id;
    var articleKeyWord = data.currentTarget.dataset.name;
    var contentType = data.currentTarget.dataset.type;
    var stateType = data.currentTarget.dataset.postid;
    if (contentType == 0 || contentType == 1) {
      wx.navigateTo({
        url: '../detail/detail?articleId=' + id + '&articleKeyWord=' + articleKeyWord + '&contentType=' + contentType + '&stateType=' + stateType,
        complete: function() {
          wx.hideLoading()
        }
      })
    } else if (contentType == 2) {
      wx.navigateTo({
        url: '../paper/paper?articleId=' + id + '&articleKeyWord=' + articleKeyWord + '&contentType=' + contentType + '&stateType=' + stateType,
        complete: function() {
          wx.hideLoading()
        }
      })
    }
  },
  onShareAppMessage: function() {
    return {
      title: '专知',
      path: 'pages/index/index',
      success: function(shareTickets) {
        // 转发成功  
      },
      fail: function(res) {
        // 转发失败  
      },
      complete: function() {
        // 不管成功失败都会执行  
      }
    }
  },
})