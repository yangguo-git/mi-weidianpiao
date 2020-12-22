// pages/invoiceDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.flag = false;
    if (options.code && options.cardId) {
      const { code, cardId } = options;
      wx.openCard({
        cardList: [{
          code,
          cardId,
        }],
      })
    }
  },
  onShow: function () {
    if (this.flag) {
      wx.navigateBackMiniProgram();
    }
  },
})