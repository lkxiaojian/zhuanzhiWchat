//index.js
//获取应用实例
Page({
  data: {
    isHideNoMore: false,
    page: 0,
    hasDingYue: [],
    arcticleList: [],
    arcticleType: [],
    imageUrl: "https://xiaochengxu.zhuanzhilink.com:4443/img"
  },
  onLoad: function() {
    this.requestData();
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
    wx.redirectTo({
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
        var totalAll = [];
        console.log(res.data);
        var article = res.data.result.article;
        if (article && article.length > 0) { //是不是为空
          for (var i = 0; i < article.length; i++) {
            var art = article[i];
            var createTime = getApp().convertTime(art.create_time);
            art.create_time = createTime;
            totalAll.push({
              firstItem: art,
              page: 0,
              childItems: []
            });
          }
          if (that.data.page == 0) { //是不是第一页
            this.setData({
              hasDingYue: res.data.result.attention,
              arcticleList: totalAll,
              isHideNoMore: false,
            })
          } else {
            this.setData({
              arcticleList: that.data.arcticleList.concat(totalAll),
              isHideNoMore: false,
            })
          }
        } else {
          this.setData({
            isHideNoMore: true,
          })
        }
      },
      complete: function() {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },
  toSearch: function() {
    wx.redirectTo({
      url: '../search/search'
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
        page: this.data.arcticleList[index].page
      },
      method: 'GET',
      success: function(res) {
        var list = that.data.arcticleList;
        if (list[index].page == 0) {
          console.log('是第一页')
          list[index].childItems = res.data.result.article;
        } else {
          console.log('不是第一页')
          list[index].childItems = list[index].childItems.concat(res.data.result.article);
        }
        list[index].firstItem.num_prods = res.data.result.count;
        list[index].page = list[index].page + 1;
        that.setData({
          arcticleList: list
        })
        console.log(that.data);
      },
    })
  },
  selectAll: function(e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
    })
  }
})