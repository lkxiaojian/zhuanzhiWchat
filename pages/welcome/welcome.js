var app = getApp();
var isFlage = 'false';
Page({
  data: {
    isShowDialog: false,
    result: [],
    sureid: false,
    arr: [],
  },
  onLoad(options) {
    getApp().login();
    var that = this;
    let isIpx = app.globalData.isIpx;
    isFlage = wx.getStorageSync("register");
    if (isFlage != 'true') {
      isFlage = 'false';
    }
    this.setData({
      statusHeight: getApp().globalData.statusBarHeight,
      navH: getApp().globalData.navHeight,
      noSelect: 'title titles',
      hasSelect: 'title title_on',
      isFlat: isFlage,
      isIpx: isIpx,
    })
    wx.request({
      url: getApp().globalData.baseUrl + '/select/articleType/rest',
      method: 'GET',
      // success: function(res) {
      //   that.setData({
      //     result: res.data.result,
      //   })
      // },
      success: function (res) {
        for (var i = 0; i < res.data.result.length; i++) {
          for (var j = 0; j < res.data.result[i].item.length; j++) {
            var pattern = /[\u3002|\uff0c]/;
            var nameS = res.data.result[i].item[j].article_type_name;
            let typeNameS = pattern.test(nameS) ? nameS : nameS.replace(/,/g, '')
            res.data.result[i].item[j].article_type_name = typeNameS;
          }
        }
        that.setData({
          result: res.data.result,
        })
      },
    })
  },
  selectRep: function(e) {
    var index = e.currentTarget.dataset.selectindex; //当前点击元素的自定义数据，这个很关键
    this.data.result.forEach(i => {
      i.item.forEach(j => {
        if (index == j.article_type_id) {
          if (j.sureid == 'false') {
            j.sureid = 'true'
          } else {
            j.sureid = 'false'
          }
        }
      })
    })
    this.setData({
      result: this.data.result,
    })
  },
  startApp: function() {
    var that = this;
    var selectIndex = this.data.result;
    var selectData = "";
    selectIndex.forEach(i => {
      i.item.forEach(j => {
        if (j.sureid == 'true') {
          selectData = selectData + j.article_type_id + ",";
        }
      })
    })
    if (selectData != "") {
      wx.request({
        url: app.globalData.baseUrl + '/user/setAttention/rest',
        data: {
          wechatid: app.globalData.wxId,
          attentions: selectData,
          type: ''
        },
        method: "GET",
        success(res) {}
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
    }
  },
  goFirst: function(e) {
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