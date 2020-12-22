// pages/merchant_home/merchant_home.js
var option = '',
  that;
const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const {
  getUrlParams
} = require('../../utils/util.js');
const {
  scanGodown
} = require("../../utils/apiRequest.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: '',
    phoneNumber:'',
    qrCodeParam: '',
    showLoginModal: false,
    hasUserInfo: false,
    scanGodown_status: false, //是否请求过 scanGodown
  },
  shopNumber(){
    // 拨打电话
    let phoneNumber = this.data.phoneNumber;
      wx.makePhoneCall({
        phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
      })
  },
  nav_payPoint() {
    wx.navigateTo({
      url: './payPoint/payPoint' + option,
    })
  },
  
  nav_myCoupons() {
    if (app.globalData.userAllInfo) {
      if (!wx.getStorageSync('scanGodown_status')) {
        that.login()
        return
      }
      if (that.data.appId) {

        scanGodown({
          tableCard: that.data.appId.replace(/\s+/g, ''),
          session: wx.getStorageSync('sessionCode'),
        }).then(res => {
          wx.navigateTo({
            url: '../myCoupons/myCoupons' + option,
          })
        })
      }
    } else {
      // 查看是否授权
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                app.globalData.userAllInfo = res
                if (!wx.getStorageSync('scanGodown_status')) {
                  that.login()
                  return
                }
                if (that.data.appId) {

                  scanGodown({
                    tableCard: that.data.appId.replace(/\s+/g, ''),
                    session: wx.getStorageSync('sessionCode'),
                  }).then(res => {
                    wx.navigateTo({
                      url: '../myCoupons/myCoupons' + option,
                    })
                  })
                }
              }
            })
          } else {
            that.setData({
              showLoginModal: true
            })
          }
        }
      })
    }
  },
  nav_openPage() {
    wx.navigateTo({
      url: '../openPage/openPage?m_appId=' + this.data.appId,
    })
  },
  nav_wifi() {
    wx.navigateTo({
      url: './wifi/wifi?m_appId=' + this.data.appId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    const {
      m_appId,
      q
    } = options;
    if (m_appId) {
      that.data.appId = m_appId;
      option = '?m_appId=' + m_appId;
      console.log('option', option)
      const url = option.split("?")[1];
      that.setData({
        appId: m_appId,
      })
    }
    if (q) {
      const urlStr = decodeURIComponent(q);
      if (urlStr.indexOf("?") != -1) {
        const url = urlStr.split("?")[1];
        const str = getUrlParams(url);
        that.setData({
          qrCodeParam: str.i,
        })
        option = '?m_appId=' + str.i;
      }
    }
    this.getInvoiceShopInfo()
  },
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          that.loginRequest(res.code);
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
        rawData: app.globalData.userAllInfo ? app.globalData.userAllInfo.rawData : ''
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
          wx.setStorageSync('scanGodown_status', true);
          wx.setStorageSync('deadline', new Date())
          if (that.data.appId || that.data.qrCodeParam) {
            that.nav_myCoupons();
          }
        }
      },
      complete: (res) => {}
    })
  },

  getInvoiceShopInfo() {
    wx.request({
      url: api.getInvoiceShopInfo(),
      data: {
        appId: that.data.appId || '',
        qrCodeParam: that.data.qrCodeParam || '',
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const {
          success,
          module,
          errorMsg
        } = res.data;
        if (success && module) {

          that.setData({
            isCanSubmit: true,
            shopName: module.shopName,
            appId: module.appId,
            phoneNumber: module.shopTelephone,
            shopAddress: module.shopAddress,
            logUrl: module.logUrl ? module.logUrl : '',
            canOpenType: module.fastType,
            selectTypeIndex: module.fastType === 0 || module.fastType === 2 ? 0 : 1,
          })
          scanGodown({
            tableCard: module.appId.replace(/\s+/g, ''),
            session: wx.getStorageSync('sessionCode'),
          }).then().catch(err => console.log(err))
        } else {
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },
  refuseLogin: function(e) {
    var that = that
    that.setData({
      showLoginModal: false
    })
  },
  showLoginModal(e) {
    var that = that
    // console.log(e)
    that.setData({
      clickIndex: e.detail.clickIndex
    })
    if (!e.detail.isLogin) {
      that.setData({
        showLoginModal: true
      })
    }
  },
  acceptLogin(e) {
    app.globalData.userAllInfo = e.detail
    app.globalData.userInfo = e.detail.userInfo
    that.login();
    if (e.detail.userInfo) {
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      that.setData({
        hasUserInfo: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      my_swiper_show: false
    })
  },
  onShow: function () {
    this.setData({
      my_swiper_show:true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})