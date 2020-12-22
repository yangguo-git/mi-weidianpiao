const {
  isBind,
  isAudit,
  bind
} = require("../../utils/apiRequest.js")
const app = getApp()
var that;
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const { getUrlParams } = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: [],
    selectIndex: 'null',
    appId: '',
    shopName: '',
    selectTypeIndex: 3,
    logUrl: "",
    canOpenType: 3,
    qrCodeParam: '',
    isCanSubmit: false,
    benefit: true,
    userInfo: {},
    userInfo_show: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { m_appId, q } = options;
    this.appId = m_appId;
    if (m_appId) {
      this.setData({
        appId: m_appId,
      });
    }
    if (q) {
      const urlStr = decodeURIComponent(q);
      if (urlStr.indexOf("?") != -1) {
        const url = urlStr.split("?")[1];
        const str = getUrlParams(url);
        this.qrCodeParam = str.i;
        this.setData({
          qrCodeParam: str.i,
        })
      }
    }
    this.showModal();
  },
  getUserInfo: function (e) {
    var that = this
    console.log(e)
    app.globalData.userAllInfo = e.detail
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      that.setData({
        userInfo: e.detail.userInfo,
        userInfo_show: true
      })
      this.login();
    } else {
      that.setData({
        userInfo_show: false
      })
    }
    that.sessionIsExpire();
  },
  showModal() {
    const session = wx.getStorageSync('sessionCode');
    const deadLine = wx.getStorageSync('deadline');
    const date = new Date(deadLine);
    const nowDate = new Date();
    if (session && deadLine) {
      const dValue = nowDate.getTime() - date.getTime();
      const hour = dValue * 1.0 / (1000 * 60 * 60)
      if (hour >= 24) {
        this.setData({
          userInfo_show:false
        })
      } else {
        this.getInvoiceTitleList();
        if (this.appId || this.qrCodeParam) {
          this.getInvoiceShopInfo();
        }
      }
    } else {
      this.setData({
        userInfo_show: false
      })
    }
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
        this.getInvoiceTitleList();
        if (this.appId || this.qrCodeParam) {
          this.getInvoiceShopInfo();
        }
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
        // encryptedData: app.globalData.userAllInfo.encryptedData,
        // iv: app.globalData.userAllInfo.iv,
        // signature: app.globalData.userAllInfo.rawData,
        rawData: app.globalData.userAllInfo.rawData
      },
      success: (response) => {
        const { data } = response;
        if (data.success == true) {
          const { session } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('scanGodown_status', true);
          this.setData({
            userInfo_show:false
          })
          wx.setStorageSync('deadline', new Date())
          this.getInvoiceTitleList();
          if (this.appId || this.qrCodeParam) {
            this.getInvoiceShopInfo();
          }
          // setTimeout(() => {
          //   const url = `${api.getCodeImage()}?session=${session}&v=${Math.random()}`;
          //   this.setData({
          //     codeImageUrl: url,
          //   })
          // }, 100);
        }
      },
      complete: (res) => {
      }
    })
  },
  getInvoiceTitleList() {
    wx.request({
      url: api.getInvoiceTitleList(),
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      data: {
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {
        const { module, success } = res.data;
        if (success && module) {
          this.setData({
            invoiceList: module,
          })
          if (module.length == 1) {
            this.setData({
              selectIndex: 0,
            })
            return;
          }
          module.map((item, index) => {
            if (item.isLast === 1) {
              this.setData({
                selectIndex: index,
              })
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onShow: function (options) {
    that = this
   
  },
  getInvoiceShopInfo() {
    wx.request({
      url: api.getInvoiceShopInfo(),
      data: {
        appId: this.data.appId || '',
        qrCodeParam: this.data.qrCodeParam || '',
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { success, module, errorMsg } = res.data;
        if (success && module) {

          this.setData({
            isCanSubmit: true,
            shopName: module.shopName,
            appId: module.appId,
            logUrl: module.logUrl ? module.logUrl : '',
            canOpenType: module.fastType,
            selectTypeIndex: module.fastType === 0 || module.fastType === 2 ? 0 : 1,
          })
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
  //hongwb add
  closeModal: function (e) {
    var that = this;
    that.setData({
      userInfo_show: true
    })
  },
  sureBind: function () {
    if (!wx.getStorageSync('scanGodown_status')) {
      that.setData({
        userInfo_show:true
      })
      return
    }else{
      bind({ "tableCard": wx.getStorageSync("tableCard") }).then(res => {
        console.log(res)
        wx.redirectTo({
          url: '/pages/bindSuccess/bindSuccess'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
})