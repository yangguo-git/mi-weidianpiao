// pages/invoiceDtail/index.js
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
      this.setData({
        detail,
      })
    }
  },
})