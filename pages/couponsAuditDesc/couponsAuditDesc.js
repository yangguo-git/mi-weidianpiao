const {
  auditList,
  auditCardDetail,
  decrypt
} = require("../../utils/apiRequest.js")
const {
  formatCouponsCardDesc
} = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // coupons: {
    //   id: '1',
    //   title: "海底捞火锅（西直门店）",
    //   cardType: "DISCOUNT",
    //   cardValue: "9.5",
    //   vailyTime: "2017-07-02至2019-12-03",
    //   cardCode: "WG67NS"
    // },
    // cardUse: ['凭此券到本店消费可享全场9.5折扣优惠', '仅支持本店使用', '此券不与其他优惠活动同享'],
    coupons:[],
    cardNotice: ['不找零不兑换', '不建议在店铺中当工作人员面使用']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    auditCardDetail({"id":options.id}).then(res=>{
      if(res.module){
        that.setData({
          coupons:formatCouponsCardDesc(res.module)
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  },
  useNow: function () {
    var that = this
    if (that.data.id) {
      decrypt({ id: that.data.id }).then(
        wx.showModal({
          title: '提示',
          content: '您确定要使用该优惠券吗',
          success(res) {
            if (res.confirm) {
              wx.showToast({
                title: '已成功使用',
                duration: 2000,
                icon: 'none'
              }),
                that.setData({
                  disabled: true
                })
            } else if (res.cancel) {
              wx.showToast({
                title: '已取消',
                duration: 2000,
                icon: 'none'
              })
            }
          }
        })
      ).catch(err => {
        console.log(err)
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})