// pages/invoiceDtail/index.js
const conf = require('../../utils/conf.js');
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.detail){
      const detail = JSON.parse(decodeURIComponent(options.detail))
      this.detail = detail;
      this.setData({
        detail,
      })
    }
    if (options.id) {
      this.uuid = options.id;
      this.sessionIsExpire()
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
        this.getInvoiceById();
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
        minipId: api.minipId
      },
      success: (response) => {
        const { data } = response;
        if (data.success == true) {
          const { session } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('deadline', new Date())
          this.getInvoiceById();
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
  getInvoiceById() {
    wx.request({
      url: api.getInvoiceById(),
      data: {
        uuid: this.uuid,
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        if (res.data.success == true) {
          this.setData({
            detail: res.data.module,
          })
          this.detail = res.data.module;
        }
      }
    })
  },
  addToCard() {
    const detail= this.detail;
    if (detail.carStatus === 0 ) {
      wx.navigateToMiniProgram({
        appId: detail.appid,
        path: detail.authUrl,
      })
    }
    if (detail.carStatus === 1) {
      wx.openCard({
        cardList: [{
          cardId: detail.cardId,
          code: detail.cardCode,
        }],
      })
    }
  },
  toSendMail() {
    wx.navigateTo({
      url: `/pages/sendEmail/index?emailTopdf=${encodeURIComponent(this.detail.emailTopdf)}&pdf=${encodeURIComponent(this.detail.pdf)}`,
    })
  },
})