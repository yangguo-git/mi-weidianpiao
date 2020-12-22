// pages/sendEmail/index.js
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdf:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pdf = options.pdf;
    this.emailTopdf = options.emailTopdf;
    this.setData({
      pdf: decodeURIComponent(this.pdf),
      emailTopdf: decodeURIComponent(this.emailTopdf),
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
  },
  imageLoad() {
    wx.hideLoading();
  },
  inputEvent(e) {
    const { value } = e.detail;
    this.email = value;
  },
  sendMyInvoiceToEmail() {
    if (!this.email) {
      wx.showToast({
        title: '请您输入邮箱！',
        icon: 'none',
      });
      return;
    }
    const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!pattern.test(this.email)) {
      wx.showToast({
        title: '你输入的邮箱有误！',
        icon: 'none',
      });
      return;
    }
    if (this.openRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.openRequestFlag = true;
    wx.request({
      url: api.sendMyInvoiceToEmail(),
      data: {
        email: this.email,
        session: wx.getStorageSync('sessionCode'),
        pdf: decodeURIComponent(this.emailTopdf),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        wx.hideToast();
        if (res.data.success) {
          wx.showToast({
            title: '发送成功',
          });
        }
      },
      complete: (res) => {
        setTimeout(() => {
          wx.hideLoading();
          this.openRequestFlag = false;
        }, 600)
      },
    })
  },
})