var app = getApp();
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    // console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    /* 初始化蓝牙适配器 */
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('初始化蓝牙适配器成功');
        that.openBluetooth();
      },
    })

  },

  onShow: function () {
    console.log("onshow");
    var that = this;
    wx.showLoading({
      title: '请打开蓝牙',
    });
    var device = [];
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log('关闭蓝牙模块');
        /* 初始化蓝牙适配器 */
        that.openBlueTooth()

      }
    });

  },
  openBlueTooth: function () {
    var that=this;
    var device = [];
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('初始化蓝牙适配器成功');
        wx.hideLoading();
        wx.startBluetoothDevicesDiscovery({
          services: [],
          allowDuplicatesKey: false,
          success: function (res) {
            console.log('这里是开始搜索附近设备', res);
            wx.onBluetoothDeviceFound(function (res) {
              console.log("成功", res);

              /* 获取设备信号，判断信号强度 */
              var device_RSSI_1 = res.devices[0].RSSI;
              var device_RSSI_2 = Number(device_RSSI_1);
              var device_RSSI = Math.abs(device_RSSI_2);
              if (device_RSSI <= 60) {

                var img = "../blue-tooth/images/signal4.png"

              } else if (device_RSSI > 60 && device_RSSI <= 70) {
                var img = "../blue-tooth/images/signal3.png"

              } else if (device_RSSI > 70 && device_RSSI <= 80) {

                var img = "../blue-tooth/images/signal2.png"

              } else if (device_RSSI > 80) {

                var img = "../blue-tooth/images/signal1.png"

              }


              if (res.devices[0].name == "") {
                var temp = {
                  ID: res.devices[0].deviceId,
                  name: "Unknow device",
                  RSSI: res.devices[0].RSSI,
                  img: img
                }
              } else {


                  var temp = {
                    ID: res.devices[0].deviceId,
                    name: "我的设备",
                    RSSI: res.devices[0].RSSI,
                    img: img

                }
              }
              device.push(temp);
              that.setData({
                device: device
              });
              that.group(that.data.device, 'ID')
            });
          },
        });
      },
    })
  },
  /* 下拉刷新页面 */
  onPullDownRefresh: function (event) {
    var that = this;
    console.log('开始下拉刷新事件');
    wx.showNavigationBarLoading();  //加载动画开始
    that.again_search();
  },
  again_search: function () {
    var that = this;
    var device = [];
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log('关闭蓝牙模块')
      }
    });
    /* 初始化蓝牙适配器 */
    that.openBlueTooth();
  },
  /* 去重 */
  group: function (data, key) {
    var that = this;
    var obj = {}, arr = [];
    for (var a = 0; a < data.length; a++) {
      if (!obj[data[a][key]]) {
        obj[data[a][key]] = [data[a]];
        arr.push(data[a]);
        that.setData({
          deviceArray: arr
        });
      } else {
        obj[data[a][key]].push(data[a]);
      }
    }
  },
  /* 点击事件 */
  onLianTap: function (event) {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('停止搜索设备', res)
      }
    })


      app.globalData.deviceid = event.currentTarget.dataset.deviceid;
      app.globalData.devicename = event.currentTarget.dataset.devicename;
    wx.showToast({
      title: '蓝牙配对成功',
      duration: 1000,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)


  
    // wx.navigateTo({
    //   url: '../blue-tooth/detail/detail?id=' + title + '&name=' + name
    // })
  },
})
