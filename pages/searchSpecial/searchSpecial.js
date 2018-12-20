// pages/special/special.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    articleTypes: [],
    imageUrl: getApp().globalData.imageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tar = this.cleanSpelChar(options.item)
    let item = JSON.parse(tar);
    that.data.articleTypes=item;
     this.setData({
          articleTypes: item,

      })

    // wx.request({
    //   url: getApp().globalData.baseUrl + '/article/getalltype/rest',
    //   data: {
    //     wechatid: getApp().globalData.wxId
    //   },
    //   method: "GET",
    //   success: res => {
    //     this.setData({
    //       articleTypes: res.data.result
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },
  back: function () {
    console.log('返回上级目录');
    wx.navigateBack();
  },
  dingyue: function (e) {
    var that = this;
    var app = getApp();
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
      data: {
        wechatid: app.globalData.wxId,
        attentions: that.data.articleTypes[index].article_type_id
      },
      method: "GET",
      success(res) {
        if (res.data.code == 0) {
          that.data.articleTypes[index].type_id = 1;
          that.setData(that.data);
        }
      }
    })
  },
  cleanSpelChar: function (localData) {
    var goodChar = "~!@#$%^&*()_+-=`[]{};':\"\\|,./<>?\n\r";
    var noiseChar = "～！＠＃＄％＾＆＊（）＿＋－＝｀［］｛｝；＇：＂＼｜，．／＜＞？　　";
    for (var i = 0; i < goodChar.length; i++) {
      var oneChar = goodChar.charAt(i);
      var towChar = noiseChar.charAt(i)
      while (localData.indexOf(towChar) >= 0) {
        localData = localData.replace(towChar, oneChar)
      }
    }
    return localData;

  },
  quxiao: function (e) {
    var app = getApp();
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
      data: {
        wechatid: app.globalData.wxId,
        attentions: that.data.articleTypes[index].article_type_id,
        type: 1
      },
      method: "GET",
      success(res) {
        if (res.data.code == 0) {
          that.data.articleTypes[index].type_id = 2;
          that.setData(that.data);
        }
      }
    })
  },
  selectAll: function (e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var image = e.currentTarget.dataset.image;
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id + "&imageUrl=" + image,
    })
  }
})