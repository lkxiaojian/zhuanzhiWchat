//app.js
var util = require('utils/util.js');
App({
  login:function(){
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              //3.解密用户信息 获取unionId
              wx.request({//获取wxId
                url: getApp().globalData.baseUrl + '/user/decodeUserInfo',
                data: {
                  iv: res.iv,
                  code: code
                },
                method: 'POST',
                success(res) {
                  var userInfo = getApp().globalData.userInfo;//获取用户信息
                  getApp().globalData.wxId = res.data.openid;//存储微信ID
                   console.log(res);
                   var value = wx.getStorageSync("register");
                   console.log(value);
                  if (value!= "true") {
                    that.register();
                  } else {
                    console.log("已注册")
                  }                  
                }
              });
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      }
    });
  },
  register:function(){
    console.log("======注册======");
    var app = getApp();
    var userInfo = app.globalData.userInfo;
    wx.request({//用户进行注册
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
  getUserInfo:function(){
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
  onShow: function (options) {
    //wx.setStorageSync("register", "false");
    this.getUserInfo();
    var res = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = res.statusBarHeight * 2

  },
  /**
   * 时间戳转化为年 月 日 时 分 秒
   * number: 传入时间戳
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
   */
  convertTime: function (time) {
    var curentDate = new Date().getTime();
    var createDatee = new Date(time).getTime();
    
    var hour = Math.ceil((curentDate - createDatee) / (1000 * 60 * 60 * 24));  
    // console.log(hour);
    if (hour < 1) {
      return  "刚刚更新";
    } else if (hour<24) {
      return hour+"小时前更新"
    }else{
   var day=   Math.ceil(hour / 24);
   if(day<=3){
     return  day+"天前更新"
   }else{
     return "很久之前更新";
   }

    
    }
  },
  setGreenText: function (str, keyword) {
    //return str.replace(keyword, "<text style='color:#16af12'>" + keyword+"</text>") test
    return str;
  },
  globalData: {
    statusBarHeight: 0,
    userInfo: null,
    wxId: "",
    baseUrl: "https://xiaochengxu.zhuanzhilink.com:4443/api",
    imageUrl: "https://xiaochengxu.zhuanzhilink.com:4443/img"
  }
})