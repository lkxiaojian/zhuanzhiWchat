// pages/welcome/welcome.js
var app = getApp();
var isFlage = 'false';
Page({
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
      repContent: [{
          message: '传感器产品',
          index: '1'
        },
        {
          message: '3D打印设计建模&软件',
          index: '2'
        },
        {
          message: '机器人产业发展',
          index: '3'
        },
        {
          message: '传感器应用',
          index: '4'
        },
        {
          message: '3D打印材料&设备',
          index: '5'
        },
        {
          message: '传感器技术',
          index: '6'
        },
        {
          message: '3D打印应用',
          index: '7'
        },
        {
          message: '机器人应用',
          index: '8'
        },
        {
          message: '3D打印行业发展',
          index: '9'
        },
        {
          message: '3D打印技术',
          index: '10'
        },
        {
          message: '工业机器人',
          index: '11'
        },
        {
          message: '传感器行业发展',
          index: '12'
        },
        {
          message: '机器人技术',
          index: '13'
        },
        {
          message: '智能制造',
          index: '14'
        },
        {
          message: '机器人制造',
          index: '15'
        }
      ],
      selectIndex: [{
          sureid: false,
          id: '4',
        },
        {
          sureid: false,
          id: '18'
        },
        {
          sureid: false,
          id: '12'
        },
        {
          sureid: false,
          id: '5'
        },
        {
          sureid: false,
          id: '8'
        },
        {
          sureid: false,
          id: '6'
        },
        {
          sureid: false,
          id: '9'
        },
        {
          sureid: false,
          id: '48'
        },
        {
          sureid: false,
          id: '10'
        },
        {
          sureid: false,
          id: '11'
        },
        {
          sureid: false,
          id: '13'
        },
        {
          sureid: false,
          id: '7'
        },
        {
          sureid: false,
          id: '14'
        },
        {
          sureid: false,
          id: '17'
        },
        {
          sureid: false,
          id: '15'
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
  startApp: function() {
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
    console.log(selectData);
    if (selectData != "") {
      console.log(selectData);
      wx.request({
        url: app.globalData.baseUrl + '/user/setAttention/rest', //仅为示例，并非真实的接口地址
        data: {
          wechatid: app.globalData.wxId,
          attentions: selectData,
          type: ''
        },
        method: "GET",
        success(res) {
          console.log(res.data)
        }
      })
    }
    wx.redirectTo({
      url: '../index/index',
    });
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
                  console.log(res);
                  var value = wx.getStorageSync("register");
                  console.log(value);
                  if (value != "true") {
                    that.register();
                  } else {
                    console.log("已注册")
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
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      }
    });
  },
  register: function() {
    console.log("======注册======");
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
        console.log(res);
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
        console.info(shareTickets + '成功');
        // 转发成功  
      },
      fail: function(res) {
        console.log(res + '失败');
        // 转发失败  
      },
      complete: function() {
        // 不管成功失败都会执行  
        console.log(res);
      }
    }
  }

})