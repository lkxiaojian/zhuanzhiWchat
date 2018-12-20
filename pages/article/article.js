// pages/article/article.js
var imagUrl = getApp().globalData.imageUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideNoMore: false,
    typeName:"",
    typeId:"",
    page: 0,
    arcticleList: [],
    imagUrl: getApp().globalData.imageUrl,
    imageBack:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      typeName: options.typeName,
      typeId: options.typeId,

    });
    this.requestData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //刷新数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page++;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //加载数据
  },
   requestData: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/trait/rest',
      data: {
        articleId: that.data.typeId,
        page: that.data.page
      },
      method: "GET",
      success:function(res){
        console.log(res);
        var article = res.data.result;
        if (article.length > 0) { //是不是为空
     
          var backUrl = article[0].iamge_back;
          if (that.data.page == 0) { //是不是第一页
            that.setData({
              arcticleList: article,
              isHideNoMore: false,
              imageBack: imagUrl+ backUrl
            })
          } else {
            that.setData({
              arcticleList: that.data.arcticleList.concat(article),
              isHideNoMore: false,
              imageBack: imagUrl+ backUrl
            })
          }
        } else {
          that.setData({
            isHideNoMore: true,
          })
        }
      },
      fail:function(){
        console.log("失败");
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },
  selectDetail:function(e){
   var id =  e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '../detail/detail?articleId='+id
   })
  },
  back: function () {
    console.log('返回上级目录');
    wx.navigateBack();
  },
  onShareAppMessage: function () {
    return {
      title: '专知',
      path: 'pages/article/article',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功  
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
})