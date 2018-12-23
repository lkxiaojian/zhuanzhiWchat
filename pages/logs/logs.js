//logs.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var htmlContent = '';

    // var htmlContent = '<div>我是HTML代码</div>';
  
    WxParse.wxParse('detailHtml', 'html', htmlContent, this, 0);
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
