// pages/success/index.js
const conf = require('../../utils/conf.js');
const api = require('../../utils/api.js');
const {
  getContactMessageType
} = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBackButton: false,
    showDiversion: '',
    diversionItem: {},
    enterType: '',
    showCover: false,
    isShowCode: false,
    url: '/images/3f63ef6054f52a0408cc5a6a1d0ee65.png'
  },
  navMiniP() {
    wx.navigateToMiniProgram({
      appId: 'wxdbba7ed6bb4cecc1',
      path: '',
      extraData: {},
      envVersion: '',
      success(res) {
        // 打开成功
      }
    })
  },
  // 展示二维码的图片
  showCode() {
    this.setData({
      isShowCode: true
    })
  },
  // 取消按钮
  cancelBtn: function () {
    let {
      isShowCode
    } = this.data;
    isShowCode = false;
    this.setData({
      isShowCode
    })
  },
  // 蒙层
  maskBox: function () {
    let {
      isShowCode
    } = this.data;
    isShowCode = false;
    this.setData({
      isShowCode
    })
  },
  handleSave: function () {
    var that=this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.openSetting({
            success(res) {}
          })
        } else {

          wx.saveImageToPhotosAlbum({
            filePath: '/images/3f63ef6054f52a0408cc5a6a1d0ee65.png',
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                isShowCode:false
              })
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options);
    this.options = options;
    this.setData({
      showBackButton: options.invoiceList ? false : true,
      showCover: options.invoiceList ? false : true,
    })
    if (options.enterType) {
      console.log(options);
      this.enterType = options.enterType;
      const {
        orderId
      } = options
      this.setData({
        enterType: this.enterType,
        orderId
      })
    }
    this.sessionIsExpire();
  },
  sessionIsExpire() {
    const session = wx.getStorageSync('sessionCode');
    const deadLine = wx.getStorageSync('deadline');
    const date = new Date(deadLine);
    const nowDate = new Date();
    if (session && deadLine) {
      const dValue = nowDate.getTime() - date.getTime();
      const hour = dValue * 1.0 / (1000 * 60 * 60)
      if (hour >= 24) {
        this.login()
      } else {
        // setTimeout(() => {
        //   const url = `${api.getCodeImage()}?session=${wx.getStorageSync('sessionCode')}&v=${Math.random()}`;
        //   this.setData({
        //     // codeImageUrl: api.getCodeImage()+'?session='+Math.random(),
        //     codeImageUrl: url,
        //   })
        // }, 50);
        this.getContactMessageType();
      }
    } else {
      this.login()
    }
  },
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.loginRequest(res.code);
        }
      },
    })
  },
  loginRequest(code) {
    wx.request({
      url: api.login(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        code: code,
        minipId: api.minipId,
      },
      success: (response) => {
        const {
          data
        } = response;
        if (data.success == true) {
          const {
            session
          } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('deadline', new Date())
          this.getContactMessageType();
          // setTimeout(() => {
          //   const url = `${api.getCodeImage()}?session=${session}&v=${Math.random()}`;
          //   this.setData({
          //     codeImageUrl: url,
          //   })
          // }, 100);
        }
      },
      complete: (res) => {}
    })
  },
  goDiversion() {
    wx.navigateToMiniProgram({
      appId: 'wxf5a6c3daaac65ab6',
      path: 'pages/index/index?channel=jsfp.dx.xcx.jsypin.com',
      extraData: {},
      envVersion: '',
      success: function (res) {
        conf.saveJumpRecord({
          appId: 'wxf5a6c3daaac65ab6',
          path: 'pages/index/index?channel=jsfp.dx.xcx.jsypin.com',
          pathDesc: '幸运好礼抽奖页面',
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
    this.setData({
      showCover: false
    })
  },
  getContactMessageType() {
    wx.request({
      url: getContactMessageType(),
      data: {
        enterType: this.enterType,
        session: wx.getStorageSync('sessionCode')
      },
      header: conf.getHeader(),
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        const {
          success,
          module
        } = res.data;
        // console.log(res);
        if (success) {
          this.setData({
            showDiversion: true,
            diversionItem: module
          })
        } else {
          this.setData({
            showDiversion: false,
          })
        }
      },
    })
  },
  goBack() {
    // wx.reLaunch({
    //   url: `/pages/flashIndex/index`,
    // })
    // this.options.jumpData
    let data = this.options.jumpData ? JSON.parse(decodeURIComponent(this.options.jumpData)) : {};
    const paramsStr = `activityId=${data.activityId}&appid=${data.minipAppid}&openid=${data.openid}&reqNo=${data.reqNo}`
    const paramsObj = {
      activityId: data.activityId,
      appid: data.minipAppid,
      openid: data.openid,
      reqNo: data.reqNo,
    }
    wx.navigateToMiniProgram({
      appId: 'wx1a74e3dfe30a3067',
      path: `/pages/my_dial/my_dial_new?${paramsStr}`,
      extraData: paramsObj,
      envVersion: '',
      success: function (res) {
        conf.saveJumpRecord({
          appId: 'wx1a74e3dfe30a3067',
          path: '/pages/my_dial/my_dial_new?activityId=partnerprogram01',
          pathDesc: '心意有礼大转盘抽奖页面',
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  closeRedPack() {
    this.setData({
      showCover: false
    })
  },
  openRedPack() {

  },
})