var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    machineId: ''
  },
  designScanCode: function (event) {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res.result)
        /*对扫描数据做进一步处理，加数据库*/
        that.setData({
          machineId: res.result.substring(0,6)
        })
        // app.globalData.g_device = res.result;
        wx.setStorageSync('machine_device', res.result);
        console.log(res.result);
      }
    })
  },
  // 用户登录示例
  login: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')

          that.setData({
            userInfo: result,
            logged: true,
          })
        }
        else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')

              that.setData({
                userInfo: result.data.data,
                logged: true
              })

            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  Phone: function () {
    wx.makePhoneCall({
      phoneNumber: '18830251060',
    })
  },
  bluetoothtap:function(){
    var device=wx.getStorageSync("machine_device");
    if (device.length>6){
      wx.navigateTo({
        url: 'blue-tooth/bluetooth',
      })
    }
    else{
     wx.showModal({
       title: '提示',
       content: '请先扫描设备二维码',
     })
    }
  }
})