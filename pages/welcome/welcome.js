// pages/welcome/welcome.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    noSelect: 'title title',
    hasSelect: 'title title_on',
    repContent: [{ message: '传感器产品',index:'1'},
      { message: '3D打印设计建模&软件',index: '2'}, 
      { message: '机器人产业发展', index: '3'},
      { message: '传感器应用', index: '4' },
      { message: '3D打印材料&设备', index: '5'  },
      { message: '传感器技术', index: '6' }, 
      { message: '3D打印应用', index: '7' },
      { message: '机器人应用', index: '8' },
      { message: '3D打印行业发展', index: '9' },
      { message: '3D打印技术', index: '10' },
      { message: '工业机器人', index: '11' },
      { message: '传感器行业发展', index: '12' },
      { message: '机器人技术', index: '13' },
      { message: '智能制造', index: '14' },
      { message: '机器人制造', index: '15' }],
    selectIndex: [
      { sureid: false,id: '4', },
      { sureid: false, id: '18'},
      { sureid: false, id: '12'},
      { sureid: false, id: '5' },
      { sureid: false, id: '8' },
      { sureid: false, id: '6' },
      { sureid: false, id: '9' },
      { sureid: false, id: '4' },
      { sureid: false, id: '10' },
      { sureid: false, id: '11' },
      { sureid: false, id: '13' },
      { sureid: false, id: '7' },
      { sureid: false, id: '14' },
      { sureid: false, id: '16' },
      { sureid: false, id: '17' },
    ]
  },
  //点击选择精选集
  selectRep: function (e) {
    var index = e.currentTarget.dataset.selectindex; //当前点击元素的自定义数据，这个很关键
    var selectIndex = this.data.selectIndex;  //取到data里的selectIndex
    selectIndex[index-1].sureid = !selectIndex[index-1].sureid;  //点击就赋相反的值
    this.setData({
      selectIndex: selectIndex  //将已改变属性的json数组更新
    })
  },
  startApp:function(){
    var selectIndex = this.data.selectIndex;
    var selectData = "";
    for (var i = 0; i < selectIndex.length; i++) {
      if (selectIndex[i].sureid){
        if (i == selectIndex.length - 1) {
          selectData = selectData+ selectIndex[i].id;
        } else {
          selectData = selectData + selectIndex[i].id + ",";
        }
      } 
    }
    console.log(selectData);
    if (selectData != ""){
      console.log(selectData);
      wx.request({
        url: app.globalData.baseUrl +'/user/setAttention/rest', //仅为示例，并非真实的接口地址
        data: {
          wechatid: app.globalData.wxId,
          attentions: selectData,
          type:''
        },
        method:"GET",
        success(res) {
          console.log(res.data)
        }
      })
    }
    wx.redirectTo({
      url: '../index/index',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(app.globalData.userInfo);
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

  }
})