// pages/search/search.js
var WxParse = require('../../wxParse/wxParse.js');
var key="";
var sharetypeId=0;
Page({
  /**
   * 页面的初始数据
   */

  data: {
    statusHeight: getApp().globalData.statusBarHeight,
    navH: getApp().globalData.navHeight,
    page:0,
    haseMore:1,
    searchResult:-1,
    keyword:"",
    searchList:{},
    articleType:[],
    imageUrl:"https://xiaochengxu.zhuanzhilink.com:4443/img"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    sharetypeId = options.sharetypeId;
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData(); //刷新数据
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.page++;
    wx.showNavigationBarLoading() //在标题栏中显示加载
      this.setData({
        haseMore: 3
      });
    this.requestData(); //加载数据
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '专知',
      path: 'pages/search/search?sharetypeId=1',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功  
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败  
      },
      complete: function () {
        // 不管成功失败都会执行  
        console.log(res);
      }
    }

  },
  requestData:function(){
    var app = getApp();
    var that = this;
    wx.request({
      url: getApp().globalData.baseUrl + '/article/search/rest',
      data: {
        wechatid: getApp().globalData.wxId,
        message:that.data.keyword,
        page:that.data.page
      },
      method: 'GET',
      success: function(res) {
        var more = 1;//1 初始话  2 无数据  3 加载更多
        if(!res.data.loveArticle){
          if(!res.data.notLoveArticle){
            more = 2;
            that.setData({
              haseMore:more
            });
            return;
          }
        }
        if(that.data.page==0){
          if(res.data.articleType){
            if (res.data.articleType && res.data.articleType.length>0){
              res.data.articleType[0].article_type_names=  that.hilight_word('',res.data.articleType[0].article_type_name);
              that.data.articleType = res.data.articleType;
            }
          }
          if(res.data.loveArticle){
              // that.data.searchList.loveList = res.data.loveArticle;
            if(res.data.loveArticle.length>0){
              for(var i = 0 ;i<res.data.loveArticle.length;i++){
                res.data.loveArticle[i].article_keyword = getApp().handleKeyWord(res.data.loveArticle[i].article_keyword);
              }
            }
            that.data.searchList.loveList = that.splitText(res.data.loveArticle);
          }
          if (res.data.notLoveArticle && res.data.notLoveArticle.length > 0){
            if (res.data.notLoveArticle.length > 0) {
              for (var i = 0; i < res.data.notLoveArticle.length; i++) {
                res.data.notLoveArticle[i].article_keyword = getApp().handleKeyWord(res.data.notLoveArticle[i].article_keyword);
              }
            }
            // that.data.searchList.noLoveList = res.data.notLoveArticle;
            that.data.searchList.noLoveList = that.splitText(res.data.notLoveArticle)
          }
          
        }else{
          if (res.data.loveArticle) {
            // that.data.searchList.loveList = that.data.searchList.loveList.concat(res.data.loveArticle);
            that.data.searchList.loveList = that.data.searchList.loveList.concat(that.splitText(res.data.loveArticle));
          }
          if (res.data.notLoveArticle && res.data.notLoveArticle.length>0) {
            // that.data.searchList.noLoveList = that.data.searchList.noLoveList.concat(res.data.noLoveList);
            that.data.searchList.noLoveList = that.data.searchList.noLoveList.concat(that.splitText(res.data.noLoveList));
          }
        }
        if (that.data.searchList.loveList) {
          if(that.data.searchList.loveList.length>0){
            console.log('0');
            that.data.searchResult = 1;
          }else{
            that.data.searchResult = 0;
            if (that.data.searchList.noLoveList){
              console.log('0');
              if (that.data.searchList.noLoveList.length > 0) {
                console.log('0');
                that.data.searchResult = 1;
              }else{
                console.log('0');
                that.data.searchResult = 0;
              }
            }
          }
        }else{
          that.data.searchResult = 0;
          console.log('0');
          if (that.data.searchList.noLoveList) {
            console.log('0');
            if (that.data.searchList.noLoveList.length > 0) {
              console.log('0');
              that.data.searchResult = 1;
            } else {
              console.log('0');
              that.data.searchResult = 0;
            }
          }
        }
        that.setData(that.data);
        console.log(that.data);
      },
      fail: function(res) {},
      complete: function(res) {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
    })
  },
  searchArticle:function(event){
    this.data.keyword = event.detail.value;
  
    this.setData({
      keyword: event.detail.value,
      page: 0,
      haseMore: 1,
      searchResult: -1,
      searchList: {},
      articleType: [],
    });
    this.data.page = 0;
    this.requestData();
  },
  back:function(){
    // wx.redirectTo({
    //   url: '../index/index'
    // })

    if (sharetypeId == 1) {
      wx.redirectTo({
        url: '../welcome/welcome',
      });

    }else{
      wx.navigateBack({ changed: true });
    }


  },
  moreType:function(){
    var page = this;
    let str = JSON.stringify(page.data.articleType);
    var item = page.cleanSpelChar(str)
    wx.navigateTo({
      url: '../searchSpecial/searchSpecial?item=' + item+"&keyword="+page.data.keyword,
    })
  },
  cleanSpelChar: function (localData) {
    var noiseChar = "~!@#$%^&*()_+-=`[]{};':\"\\|,./<>?\n\r";
    var goodChar = "～！＠＃＄％＾＆＊（）＿＋－＝｀［］｛｝；＇：＂＼｜，．／＜＞？　　";
    for (var i = 0; i < noiseChar.length; i++) {
      var oneChar = noiseChar.charAt(i);
      var towChar = goodChar.charAt(i)
      // console.log('oneChar  ' + oneChar + '   towChar ' + towChar)
      while (localData.indexOf(oneChar) >= 0) {
        localData = localData.replace(oneChar, towChar)
      }
    }
    return localData;

  },
  startType:function(data){
    wx.showLoading({
      title: '跳转中',
    })
    var page = this;
    var id = data.currentTarget.dataset['id'];
    var name = data.currentTarget.dataset['name'];
    var image = data.currentTarget.dataset['image'];
    wx.navigateTo({
      url: '../article/article?typeName=' + name + "&typeId=" + id +"&imageBack="+image,
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  splitText:function(data){
    var that=this;
    for(var i=0;i<data.length;i++){
      data[i].article_titles= that.hilight_word(that.key, data[i].article_title);
      data[i].article_keywords = that.hilight_word(that.key, data[i].article_keyword);
      data[i].content_excerpts = that.hilight_word(that.key, data[i].content_excerpt);
    }
   return data;
  },
  hilight_word: function (key, word) {
    key = this.data.keyword;
    let idx = word.indexOf(key), t = [];

    if (idx > -1) {
      if (idx == 0) {
        t = this.hilight_word(key, word.substr(key.length));
        t.unshift({ key: true, str: key });
        return t;
      }

      if (idx > 0) {
        t = this.hilight_word(key, word.substr(idx));
        t.unshift({ key: false, str: word.substring(0, idx) });
        return t;
      }
    }
    return [{ key: false, str: word }];
  },
  selectDetail: function (data) {
    wx.showLoading({
      title: '跳转中',
    })
    var id = data.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?articleId=' + id,
      complete: function () {
        wx.hideLoading()
      }
    })
  },
})