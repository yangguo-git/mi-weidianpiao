const {
  getCardList
} = require("../../utils/apiRequest.js")
const {
  formatCouponsCard
} = require("../../utils/util.js");
var m_appId,that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    couponsCopy: [],
    initCoupons: [{
        id: '1',
        name: "海底捞火锅（西直门店）",
        type: "DISCOUNT",
        value: "9.5折",
        vailyTime: "2017-07-02至2019-12-03",
        status: "1"
      },
      {
        id: '2',
        name: "海底捞火锅（西直门店）",
        type: "DISCOUNT",
        value: "9.5折",
        vailyTime: "2017-07-02至2019-12-03",
        status: "1"
      },
      {
        id: '3',
        name: "海底捞火锅（西直门店）",
        type: "DISCOUNT",
        value: "9.5折",
        vailyTime: "2017-07-02至2019-12-03",
        status: "1"
      },
      {
        id: '4',
        name: "路边米线",
        type: "DONATE",
        value: "赠品",
        vailyTime: "2017-07-02至2019-12-03",
        status: "1"
      }
    ]
  },
  page_getCardList(){
    getCardList({
      status: "1",
      tableCard: m_appId || '',
    }).then(res => {
      console.log(res)
      res.module = formatCouponsCard(res.module)
      if (res.module.length === 0) {
        wx.showToast({
          title: '暂无优惠券',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    m_appId = options.m_appId;
    // that.setData({
    //   initCoupons: formatCouponsCard(that.data.initCoupons)
    // })
    this.page_getCardList()
  },
  goToDesc: function(e) {
    var that = this
    console.log(e.target.id)
    wx.navigateTo({
      url: '/pages/myCouponsDesc/myCouponsDesc?id=' + e.target.id
    })
  },
  goToHasuse: function() {
    wx.navigateTo({
      url: '/pages/hasUseCoupons/hasUseCoupons'
    })
  },
  goToExpired: function() {
    wx.navigateTo({
      url: '/pages/expiredCoupons/expiredCoupons'
    })
  },
  searchInput: function(e) {
    //  console.log(e.detail.value)
    var that = this
    if (!e.detail.value) {
      that.setData({
        coupons: that.data.couponsCopy
      })
    }
  },
  searchBox: function(e) {
    var that = this
    if (!e.detail.value.coupon) {
      getCardList({
        "status": "1",
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
      "status": "1",
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
  // searchBox: function(e) {
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
    var that = this
    this.page_getCardList()
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