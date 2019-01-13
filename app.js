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
                  console.log(res);
                  var value = wx.getStorageSync("register");
                  console.log(value);
                  if (value != "true") {
                    that.register();
                  } else {
                    console.log("已注册");
                    wx.redirectTo({
                      url: '../index/index',
                    })
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
              console.log("授权成功");
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              //this.login();//登录
            }
          });
        } else {
          console.log("授权失败");
        }
      }
    });
  },
  onShow: function(options) {
    var that = this;
    //wx.setStorageSync("register", "false");
    wx.getSystemInfo({
      success(res) {
        console.log("状态栏的高度" + res.statusBarHeight) // 获取状态栏的高度
        // if (res.statusBarHeight <= 38) {
        //   that.globalData.statusBarHeight = 96;
        // } else {
        //   that.globalData.statusBarHeight = 144;
        // }
        that.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    });
    that.getUserInfo();
    console.log(that.globalData.statusBarHeight);
  },
  /**
   * 时间戳转化为年 月 日 时 分 秒
   * number: 传入时间戳
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
   */
  convertTime: function(time) {
    var curentDate = new Date().getTime();
    var createDatee = new Date(time).getTime();
    var hour = Math.ceil((curentDate - createDatee) / (1000 * 60 * 60 ));
    // console.log(hour);
    if (hour < 1) {
      return "刚刚更新";
    } else if (hour < 24) {
      return hour + "小时前更新"
    } else {
      var day = Math.ceil(hour / 24);
      if (day <= 3) {
        return day + "天前更新"
      } else {
        return "很久之前更新";
      }
    }
  },
  handleKeyWord(str) {
    var char = "";
    if (str) {
      var arr = str.split(",");
      if (arr.length > 3) {
        for (var i = 0; i < 3; i++) {
          char = char + "#" + arr[i];
        }
      } else {
        for (var i = 0; i < arr.length; i++) {
          char = char + "#" + arr[i];
        }
      }
    }
    console.log(char);
    return char;
  },
  globalData: {
    statusBarHeight: 0,
    userInfo: null,
    wxId: "",
    baseUrl: "https://xiaochengxu.zhuanzhilink.com/api",
    imageUrl: "https://xiaochengxu.zhuanzhilink.com/weixin_img"
  }
})