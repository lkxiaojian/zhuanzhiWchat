// pages/search/search.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    page:0,
    haseMore:true,
    searchResult:-1,
    keyword:"",
    searchList:{},
    articleType:[],
    imageUrl:"https://xiaochengxu.zhuanzhilink.com:4443/img"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(this.data.page);
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //加载数据
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestData:function(){
    var app = getApp();
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/search/rest',
      data: {
        wechatid: getApp().globalData.wxId,
        message:that.data.keyword,
        page:that.data.page
      },
      method: 'GET',
      success: function(res) {
        var more = true;
        if(!res.data.loveArticle){
          if(!res.data.notLoveArticle){
            more = false;
            that.setData({
              haseMore:more
            });
            return;
          }
        }
        if(that.data.page==0){
          if(res.data.articleType){
            that.data.articleType = res.data.articleType;
          }
          if(res.data.loveArticle){
              that.data.searchList.loveList = res.data.loveArticle;
          }
          if (res.data.notLoveArticle && res.data.notLoveArticle.length > 0){
            that.data.searchList.noLoveList = res.data.notLoveArticle;
          }
          
        }else{
          if (res.data.loveArticle) {
            that.data.searchList.loveList = that.data.searchList.loveList.concat(res.data.loveArticle);
          }
          if (res.data.notLoveArticle && res.data.notLoveArticle.length>0) {
            that.data.searchList.noLoveList = that.data.searchList.noLoveList.concat(res.data.noLoveList);
          }
        }
        if (that.data.searchList) {
          that.data.searchResult = 1;
        }
        that.setData(that.data);
      },
      fail: function(res) {},
      complete: function(res) {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
    })
  },
  searchArticle:function(event){
    this.data.keyword = event.detail.value;
    this.setData({
      keyword: event.detail.value
    });
    this.data.page = 0;
    this.requestData();
  },
  back:function(){
    // wx.redirectTo({
    //   url: '../index/index'
    // })

    wx.navigateBack({ changed: true });
  },
  moreType:function(){
    var page = this;
    let str = JSON.stringify(page.data.articleType);

    var item = page.cleanSpelChar(str)
    wx.navigateTo({

      url: '../searchSpecial/searchSpecial?item=' + item,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })


    
    // wx.redirectTo({
    //   url: '../special/special?keyword'+that.data.keyword,
    //   success: function(res) {},
    //   fail: function(res) {}, m
    //   complete: function(res) {},
    // })
  },
  cleanSpelChar: function (localData) {
    var noiseChar = "~!@#$%^&*()_+-=`[]{};':\"\\|,./<>?\n\r";
    var goodChar = "～！＠＃＄％＾＆＊（）＿＋－＝｀［］｛｝；＇：＂＼｜，．／＜＞？　　";
    for (var i = 0; i < noiseChar.length; i++) {
      var oneChar = noiseChar.charAt(i);
      var towChar = goodChar.charAt(i)
      // console.log('oneChar  ' + oneChar + '   towChar ' + towChar)
      while (localData.indexOf(oneChar) >= 0) {
        localData = localData.replace(oneChar, towChar)
      }
    }
    return localData;

  },
  startType:function(data){
    wx.showLoading({
      title: '跳转中',
    })
    var page = this;
    var id = data.currentTarget.dataset['id'];
    var name = data.currentTarget.dataset['name'];
    var image = data.currentTarget.dataset['image'];
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id +"&imageBack="+image,
      complete: function () {
        wx.hideLoading()
      }
    })
  }
})