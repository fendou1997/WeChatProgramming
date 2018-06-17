var app = getApp();
var util=require("../../utils/star.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper1: '',
    swiper2: '',
    swiper3: '',
    length: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var requestUrl = 'https://customizedsounds.club/weicms/index.php?s=/addon/CustomizedSounds/CustomizedSounds/getList'
    this.getListData(requestUrl)
  },
  onScrollLower: function (event) {
    console.log("加载更多")
    this.getListData('https://customizedsounds.club/weicms/index.php?s=/addon/CustomizedSounds/CustomizedSounds/getList')
    wx.showNavigationBarLoading()
  },
  getListData: function (url) {
    var that = this;
    wx.request({
      url: url,
      data: { limit: app.globalData.g_limit },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.processHostData(res.data)
        app.globalData.g_limit = app.globalData.g_limit + 3
      },
    })
  },
  processHostData: function (res) {
    var modeList = [];
    for (var idx in res) {
      var subject = res[idx];
      var date = subject.datatime;//时间
      console.log(date)
      var dateBegin = new Date(date.replace(/-/g, "/"));//将-转化为/，使用new Date
      var dateEnd = new Date();//获取当前时间
      var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
      var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数

      if (minutes != 0) {
        var dateTime = minutes + "分钟";
        if (hours != 0)
        //计算相差分钟数
        {
          var dateTime = hours + "小时";
          if (dateDiff != 0) {
            var dateTime = dayDiff + "天";
          }
        }
      }
      var score = (subject.collection)*2
      var temp = {
        avatar: subject.avatar,
        title: subject.title,
        imgSrc: subject.imgsrc,
        dataTime: dateTime,
        content: subject.content,
        reading: subject.reading,
        stars: util.convertToStarArray (subject.collection),
        score: score,
        headImgSrc: subject.headimgsrc,
        author: subject.author,
        date: date,
        detail: subject.detail,
        modeId: subject.modeid,
        music: {
          dataUrl: subject.musicmp3,
          title: subject.musictitle,
          coverImgUrl: subject.musiccoverimg,

        }
      }
      modeList.push(temp);
    }
    this.setData({ mode_key: modeList });
    this.setData({
      swiper1: modeList[modeList.length - 1].headImgSrc,
      swiper2: modeList[modeList.length - 2].headImgSrc,
      swiper3: modeList[modeList.length - 3].headImgSrc,
      length: modeList.length
    })
    wx.hideNavigationBarLoading()
    wx.setStorageSync('modeData', modeList)
  },


  onSwiperTap: function (event) {
    var modeId = event.target.dataset.modeid;
    console.log(modeId)

    modeId = this.data.length - modeId+1
    console.log(modeId)
    wx.navigateTo({
      url: 'mode-detail/mode-detail?id=' + modeId,
    })
  },
  onModeTap: function (event) {
    var modeId = event.currentTarget.dataset.modeid;

    wx.navigateTo({
      url: 'mode-detail/mode-detail?id=' + modeId,
    })
  },


})