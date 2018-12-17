//app.js
var util = require('utils/util.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function(res) {
              console.log({
                encryptedData: res.encryptedData,
                iv: res.iv,
                code: code
              })
              //3.解密用户信息 获取unionId
              wx.request({//获取wxId
                url: getApp().globalData.baseUrl + '/user/decodeUserInfo',
                data: {
                  iv: res.iv,
                  code: code
                },
                method: 'POST',
                success(res) {
                  console.log(res.data.openid);
                  var userInfo = getApp().globalData.userInfo;//获取用户信息
                  getApp().globalData.wxId = res.data.openid;//存储微信ID
                  wx.request({//用户进行注册
                    url: getApp().globalData.baseUrl + '/user/register/rest',
                    data: {
                      tel_phone: "",
                      nick_name:userInfo.nickName,
                      wechat_id: res.data.openid,
                      user_sex:userInfo.gender,
                      icon_path:userInfo.avatarUrl
                    },
                    method: 'POST',
                    success(res){
                      //console.log(res);
                    }
                  })
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
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.globalData.wxId = res.signature;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow:function(options){
    var that = this
    var res = wx.getSystemInfoSync()
    console.log(res)
    that.globalData.statusBarHeight = res.statusBarHeight * 2
  },
  /**
   * 时间戳转化为年 月 日 时 分 秒
   * number: 传入时间戳
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
   */
   convertTime: function(time) {
     var date = new Date().getTime();
     console.log(date); 
     var curHour = date/3600000;
     var hour = time/3600000;
    hour = curHour-hour;
    console.log(hour); 
    if(hour<24){
      return hour+"小时前";
    }else{
      return hour/24+"天前";
    }
  },
  setGreenText:function(str,keyword){
    //return str.replace(keyword, "<text style='color:#16af12'>" + keyword+"</text>")
    return str;
  },
  globalData: {
    statusBarHeight:0,
    userInfo: null,
    wxId: "",
    baseUrl: "https://xiaochengxu.zhuanzhilink.com:4443/api",
    imageUrl:"https://xiaochengxu.zhuanzhilink.com:4443/img"
  }
})