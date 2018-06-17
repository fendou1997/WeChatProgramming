var util = require('../../../utils/util.js')
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileUrl: {},
    uploadstatus1: true,
    uploadstatus2: true,
    uploadstatus3: true,
    fileslength: 0
  },
  doRecord: function (event) {
    var that = this;
    var id = event.target.dataset.id;

    var tempFilePath = {};
    const recorderManager = wx.getRecorderManager()

    recorderManager.onStart(() => {
      wx.showToast({
        title: "开始录音",
        duration: 1000,
        icon: "success"
      })
    })


    recorderManager.onStop((res) => {
      wx.showToast({
        title: "录音结束",
        duration: 1000,
        icon: "success"
      })
      tempFilePath = res.tempFilePath
      util.showBusy('正在上传')
      console.log(tempFilePath)
      that.doUpload(tempFilePath, id)
    })


    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 2,
      encodeBitRate: 192000,
      format: 'mp3',

    }

    recorderManager.start(options)


  },

  doUpload: function (filePath, id) {

    var that = this;
    var time = new Date();
    var mytime = time.toLocaleTimeString();
    const uploadTask = wx.uploadFile({
      url: 'https://customizedsounds.club/weicms/index.php?s=/addon/Voice/Voice/add',
      filePath: filePath,
      name: "file",
      formData: {

      },
      success: function (res) {
        util.showSuccess('上传文件成功')
        console.log(res)
        res = JSON.parse(res.data)
        console.log(res)
        if (id == 1) {
          that.setData({ uploadstatus1: false })
          var length = that.data.fileslength + 1
          that.setData({ fileslength: length })
        }
        if (id == 2) {
          that.setData({ uploadstatus2: false })
          var length = that.data.fileslength + 1
          that.setData({ fileslength: length })
        }
        if (id == 3) {
          that.setData({ uploadstatus3: false })
          var length = that.data.fileslength + 1
          that.setData({ fileslength: length })
        }
        var formdata = {
          machineid: app.globalData.g_machinedata,
          voicename: filePath

        }

        wx.request({
          url: 'https://customizedsounds.club/weicms/index.php?s=/addon/Voice/Voice/addFeedback',
          data: formdata,
          header: {

          },
          success: function (res) {
            console.log(res)
            util.showSuccess('发送成功')
          },
          complete: function () {

          }
        })

      },

      fail: function (e) {
        util.showModel('fail', '上传文件失败')
      }

    })
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ ZiShu: 0 })
  },

  bindFormSubmit: function (event) {
    this.sendMessage(event.detail.value.textarea)

  },
  sendMessage: function (sth) {

    var that=this;
    var myDate = new Date();
    var ctime = myDate.toLocaleString()
    var machineid = app.globalData.g_machinedata
    var formdata = {
      message: sth,
      machineid: machineid,
      wechat: app.globalData.g_user
    }
    console.log(formdata)
    wx.request({
      url: 'https://customizedsounds.club/weicms/index.php?s=/addon/FeedBack/FeedBack/addFeedback',
      data: formdata,
      header: {

      },
      success: function (res) {
        console.log(res)
        wx.showToast({

          title: '发送成功',
          icon: 'success',
          duration: 1000,

        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
        

      },
      complete: function () {
  
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


})