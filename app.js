//app.js
var util = require('utils/util.js');
App({
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
                    // 已注册
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }
                }
              });
            },
            fail: function() {
              // 获取用户信息失败
            }
          })
        } else {
        }
      }
    });
  },
  register: function() {
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
      }
    });
  },
  getUserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 授权成功
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              //this.login();//登录
            }
          });
        } else {
          // 授权失败
        }
      }
    });
  },
  onShow: function(options) {
    var that = this;
    //wx.setStorageSync("register", "false");
    wx.getSystemInfo({
      success(res) {
        // if (res.statusBarHeight <= 38) {
        //   that.globalData.statusBarHeight = 96;
        // } else {
        //   that.globalData.statusBarHeight = 144;
        // }
        that.globalData.navHeight = res.statusBarHeight + 46;
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          that.globalData.isIpx = true
        }
      },
      fail(err) {
      }
    });
    that.getUserInfo();
  },
  /**
   * 时间戳转化为年 月 日 时 分 秒
   * number: 传入时间戳
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
   */
  convertTime: function(time) {
    var curentDate = new Date().getTime();
    var createDatee = new Date(time).getTime();
    var hour = Math.round(Math.abs((curentDate - createDatee)) / (1000 * 60 * 60));
    // var hh = new Date().getHours(); 
    if (hour < 1) {
      return "刚刚";
    } else if (hour < 24) {
      return hour + "小时前"
    } else {
      var day = Math.floor(hour / 24);
      // if (day <= 2) {
      //   return day + "天前更新"
      // } else {
      //   return "很久之前更新";
      // }
      return day + "天前"
    }
  },
  handleKeyWord(str) {
    var char = "";
    if (str) {
      var arr = str.split(",");
      if (arr.length > 20) {
        for (var i = 0; i < 20; i++) {
          char = char + "#" + arr[i];
        }
      } else {
        for (var i = 0; i < arr.length; i++) {
          char = char + "#" + arr[i];
        }
      }
    }
    return char;
  },
  globalData: {
    statusBarHeight: 0,
    userInfo: null,
    wxId: "",
    isIpx: false,
    baseUrl: "https://xiaochengxu.zhuanzhilink.com/api",
    imageUrl: "https://xiaochengxu.zhuanzhilink.com/weixin_img",
    imgBackUrl:'https://www.zhuanzhichinalink.com/images/'
  }
  // baseUrl: "http://localhost:7903",      baseUrl: "https://xiaochengxu.zhuanzhilink.com/api",

})
const updateManager = wx.getUpdateManager()
updateManager.onCheckForUpdate(function(res) {})
updateManager.onUpdateReady(function() {
  wx.showModal({
    title: '更新提示',
    content: '新版本已准备好，是否重启应用？',
    success: function(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
updateManager.onUpdateFailed(function() {
  // 新的版本下载失败
  wx.showModal({
    title: '更新提示',
    content: '新版本下载失败',
    showCancel: false
  })
})