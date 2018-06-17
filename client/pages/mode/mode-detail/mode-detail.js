var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,
    countries: ["2小时", "3小时", "4小时"],
    countryIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
      bindCountryChange: function(e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryIndex: e.detail.value
        })
    },
  onLoad: function (options) {
    var modeId = options.id - 1;
    var modedatas = wx.getStorageSync("modeData")

    var modeData = modedatas[modeId];
   
    this.data.modeid = modeId;
    this.setData(modeData);
    console.log(this.data);
    var modesCollected = wx.getStorageSync("mode_Collected");
    if (modesCollected[modeId]) {
      var modeCollected = modesCollected[modeId];
      this.setData({
        collected: modeCollected,
      });
    }
    else {
      var modesCollected = {};
      modesCollected[modeId] = false;
      wx.setStorageSync('mode_Collected', modesCollected);

    }

/** */
    var modeslove = wx.getStorageSync("mode_love");
    if (modeslove[modeId]) {
      var modelove = modeslove[modeId];
      this.setData({
        love: modelove,
      });
    }
    else {
      var modeslove = {};
      modeslove[modeId] = false;
      wx.setStorageSync('mode_love', modeslove);
    }



    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentModeId
      === modeId) {
      this.setData({ isPlayingMusic: true });
    }
    this.setAudioMornitor();
  },

  setAudioMornitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true,

      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentModeId = that.data.modeid;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentModeId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentModeId = null;
    })
  },
  onCollectionTap: function (event) {
    var modesCollected = wx.getStorageSync("mode_Collected");
    var modeCollected = modesCollected[this.data.modeid];
    modeCollected = !modeCollected;

    modesCollected[this.data.modeid] = modeCollected;
    wx.setStorageSync('mode_Collected', modesCollected);
    this.setData({
      collected: modeCollected
    }),
      wx.showToast({
        title: modeCollected ? '下载成功' : "删除成功",
        duration: 1000,
        icon: "success"
      })
    // this.showModal(modeCollected, modesCollected);

  },
  onloveTap:function(event){
    var modeslove = wx.getStorageSync("mode_love");
    var modelove = modeslove[this.data.modeid];
    modelove = !modelove;

    modeslove[this.data.modeid] = modelove;
    wx.setStorageSync('mode_love', modeslove);
    this.setData({
      love: modelove
    }),
      wx.showToast({
      title: modelove ? ' 喜欢' : "取消喜欢",
        duration: 1000,
        icon: "success"
      })
  },
  onMusicTap: function (event) {
    var that=this;
    var isPlayingMusic = this.data.isPlayingMusic;

    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })

    }
    else {
      
      wx.playBackgroundAudio({
        dataUrl: that.data.music.dataUrl,
        title: that.data.music.title,
        coverImgUrl: that.data.music.coverImgUrl,

      });
      this.setData({
        isPlayingMusic: true
      })

    }
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})