// pages/welcome/welcome.js
var app = getApp();
var isFlage = 'false';
Page({
  data: {
    isShowDialog: false,
  },
  /**
   * 页面的初始数据
   */
  onLoad(options) {
    getApp().login();
    isFlage = wx.getStorageSync("register");
    if (isFlage != 'true') {
      isFlage = 'false';
    }
    this.setData({
      statusHeight: getApp().globalData.statusBarHeight,
      navH: getApp().globalData.navHeight,
      noSelect: 'title title',
      hasSelect: 'title title_on',
      isFlat: isFlage,
      // 机器人
      robot: [{
          message: '制造',
          index: '1'
        },
        {
          message: '产品&应用',
          index: '2'
        },
        {
          message: '技术',
          index: '3'
        }, {
          message: '工业',
          index: '4'
        }, {
          message: '产业发展',
          index: '5'
        }
      ],
      // 3D打印
      printing: [{
          message: '应用',
          index: '6'
        },
        {
          message: '技术',
          index: '7'
        }, {
          message: '行业发展',
          index: '8'
        }, {
          message: '设计建模&软件',
          index: '9'
        }, {
          message: '材料&设备',
          index: '10'
        }
      ],
      // 传感器
      sensor: [{
        message: '产品',
        index: '11'
      }, {
        message: '应用',
        index: '12'
      }, {
        message: '技术',
        index: '13'
      }, {
        message: '行业发展',
        index: '14'
      }],
      // 智能制造
      intelligence: [{
        message: '智能制造',
        index: '15'
      }],
      selectIndex: [{
          sureid: false,
          name: '机器人制造',
          id: '15',
        },
        {
          sureid: false,
          name: '机器人产品&应用',
          id: '48'
        },
        {
          sureid: false,
          name: '机器人技术',
          id: '14'
        },
        {
          sureid: false,
          name: '机器人工业',
          id: '13'
        },
        {
          sureid: false,
          name: '机器人产业发展',
          id: '12'
        },
        {
          sureid: false,
          name: '3D打印应用',
          id: '9'
        },
        {
          sureid: false,
          name: '3D打印技术',
          id: '11'
        },
        {
          sureid: false,
          name: '3D打印行业发展',
          id: '10'
        },
        {
          sureid: false,
          name: '3D打印设计建模&软件',
          id: '18'
        },
        {
          sureid: false,
          name: '3D打印材料&设备',
          id: '8'
        },
        {
          sureid: false,
          name: '传感器产品',
          id: '4'
        },
        {
          sureid: false,
          name: '传感器应用',
          id: '5'
        },
        {
          sureid: false,
          name: '传感器技术',
          id: '6'
        },
        {
          sureid: false,
          name: '传感器行业发展',
          id: '7'
        },
        {
          sureid: false,
          name: '智能制造',
          id: '17'
        },
      ]
    })
  },
  //点击选择精选集
  selectRep: function(e) {
    var index = e.currentTarget.dataset.selectindex; //当前点击元素的自定义数据，这个很关键
    var selectIndex = this.data.selectIndex; //取到data里的selectIndex
    selectIndex[index - 1].sureid = !selectIndex[index - 1].sureid; //点击就赋相反的值
    this.setData({
      selectIndex: selectIndex //将已改变属性的json数组更新
    })
  },
  goFirst: function(e) {
    wx.redirectTo({
      url: '../index/index',
    });
  },
  startApp: function() {
    var that = this;
    var selectIndex = this.data.selectIndex;
    var selectData = "";
    for (var i = 0; i < selectIndex.length; i++) {
      if (selectIndex[i].sureid) {
        if (i == selectIndex.length - 1) {
          selectData = selectData + selectIndex[i].id;
        } else {
          selectData = selectData + selectIndex[i].id + ",";
        }
      }
    }
    if (selectData != "") {
      wx.request({
        url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
        data: {
          wechatid: app.globalData.wxId,
          attentions: selectData,
          type: ''
        },
        method: "GET",
        success(res) {
        }
      })
      wx.redirectTo({
        url: '../index/index',
      });
    } else {
      that.setData({
        isShowDialog: true
      });
      setTimeout(function() {
        that.setData({
          isShowDialog: false
        });
      }, 2000)
      // wx.showToast({
      //   title: '请选择你喜欢的精选集',
      // })
    }
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '正在加载初始化...',
      })
      getApp().globalData.userInfo = e.detail.userInfo;
      this.login();
      // getApp().getUserInfo();
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  login: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function(res) {
              //3.解密用户信息 获取unionId
              wx.request({ //获取wxId
                url: getApp().globalData.baseUrl + '/user/decodeUserInfo',
                data: {
                  iv: res.iv,
                  code: code
                },
                method: 'POST',
                success(res) {
                  var userInfo = getApp().globalData.userInfo; //获取用户信息
                  getApp().globalData.wxId = res.data.openid; //存储微信ID
                  var value = wx.getStorageSync("register");
                  if (value != "true") {
                    that.register();
                  } else {
                    wx.hideLoading();
                    that.startApp();
                  }
                }
              });
            },
            fail: function() {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！')
        }
      }
    });
  },
  register: function() {
    var that = this;
    var app = getApp();
    var userInfo = app.globalData.userInfo;
    wx.request({ //用户进行注册
      url: app.globalData.baseUrl + '/user/register/rest',
      data: {
        tel_phone: "",
        nick_name: userInfo.nickName,
        wechat_id: app.globalData.wxId,
        user_sex: userInfo.gender,
        icon_path: userInfo.avatarUrl
      },
      method: 'POST',
      success(res) {
        wx.setStorageSync("register", "true");
        wx.hideLoading();
        that.startApp();
      }
    });
  },
  onShareAppMessage: function() {
    return {
      title: '专知',
      path: 'pages/welcome/welcome',
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
  }

})