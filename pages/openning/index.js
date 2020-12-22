// pages/openning/index.js
const conf = require('../../utils/conf.js');
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.detail) {
      const detail = JSON.parse(decodeURIComponent(options.detail));
      this.setData({
        detail: detail.title,
      })
      this.id = detail.id;
      this.getInvoiceById();
    }
    if (options.params) {
      const detail = JSON.parse(decodeURIComponent(options.params));
      this.setData({
        detail,
      })
    }
    if (options.id) {
      this.id = options.id;
      this.getInvoiceById();
    }
  },
  getInvoiceById() {
    wx.request({
      url: api.getInvoiceById(),
      data: {
        uuid: this.id,
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { success, module } =res.data;
        if (success == true && module.paperStatus == 1) {
          wx.redirectTo({
            url: `/pages/eInvoiceDetail/index?id=${this.id}`,
          })
        } else {
          this.timer = setTimeout(() => {
            this.getInvoiceById();
          }, 2000)
        }
      }
    })
  },
  showInfo() {
    this.setData({
      show: true,
    });
  },
  hideInfo() {
    this.setData({
      show: false,
    });
  },
  onHide: function () {
    clearTimeout(this.timer)
  },
  onUnload: function () {
    clearTimeout(this.timer)
  }
})