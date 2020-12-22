const {
  getCardList
} = require("../../utils/apiRequest.js")
const {
  formatCouponsCard
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    couponsCopy: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    getCardList({
      status: "2"
    }).then(res => {
      res.module = formatCouponsCard(res.module)
      if (res.module.length === 0) {
        wx.showToast({
          title: '暂无已使用优惠券',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      that.setData({
        coupons: res.module,
        couponsCopy: res.module
      })
    }).catch(err => {
      console.log(err)
    })
  },
  goToDesc: function(e) {
    var _this = this
    console.log(e.target.id)
    wx.navigateTo({
      url: '/pages/myCouponsDesc/myCouponsDesc?id=' + e.target.id
    })
  },
  searchInput: function (e) {
    //  console.log(e.detail.value)
    var that = this
    if (!e.detail.value) {
      that.setData({
        coupons: that.data.couponsCopy
      })
    }
  },
  searchBox: function (e) {
    var that = this
    if (!e.detail.value.coupon) {
      getCardList({
        "status": "2",
        "inputContent": null
      }).then().catch(err => {
        console.log(err)
      })
      wx.showToast({
        title: '搜索的商户名为空',
        duration: 2000,
        icon: 'none'
      });
      return
    }
    getCardList({
      "status": "2",
      "inputContent": e.detail.value.coupon
    }).then(res => {
      res.module = formatCouponsCard(res.module)
      if (res.module.length === 0) {
        wx.showToast({
          title: '商家不存在或无此类优惠券',
          duration: 2000,
          icon: 'none'
        })
      }
      that.setData({
        coupons: res.module
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // searchBox: function (e) {
  //   var that = this
  //   that.setData({
  //     coupons: that.data.couponsCopy
  //   })
  //   if (!e.detail.value.coupon) {
  //     wx.showToast({
  //       title: '搜索不能为空',
  //       duration: 2000,
  //       icon: 'none'
  //     });
  //     return;
  //   }
  //   //  console.log(e.detail.value.coupon)
  //   var fcoupons = that.data.coupons.filter(
  //     item => {
  //       return item.name.indexOf(e.detail.value.coupon) >= 0
  //     }
  //   )
  //   if (fcoupons.length === 0) {
  //     wx.showToast({
  //       title: '不存在的优惠券',
  //       duration: 2000,
  //       icon: 'none'
  //     })
  //   }
  //   that.setData({
  //     coupons: fcoupons
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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