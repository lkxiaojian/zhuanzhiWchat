//logs.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var htmlContent = '<p>dsadsa</p><p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/tef730DH1dY3yBYlibDAdKJXeL6NTm9sem46oboibnU1fHPhnmIxWEw5JAXicZJ6oI7smenib4icdULFSlxic3fDtfSg/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1" style="max-width:100%;"><br></p>';

    // var htmlContent = '<div>我是HTML代码</div>';
  
    WxParse.wxParse('detailHtml', 'html', htmlContent, this, 0);
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
