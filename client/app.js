//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData: {
    g_isPlayingMusic: false,
    g_currentModeId: null,
    g_machinedata:12,
    g_user:'奋斗',
    g_limit:5,
    g_isempty:false,
    g_device: null,
    g_localName: "BLE SPP",
    g_deviceId:"",
    g_devicename:""

  },
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  }
})