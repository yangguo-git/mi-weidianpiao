const {
  getCardDetail,
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
    //   cardValue: "9.5折",
    //   vailyTime: "2017-07-02至2019-12-03",
    //   cardCode: "WG67NS"
    // },
    disabled:false,
    coupons:[],
    cardUse: ['凭此券到本店消费可享全场9.5折扣优惠', '仅支持本店使用','此券不与其他优惠活动同享'],
    cardNotice: ['不找零不兑换','建议在店铺中当工作人员面使用'],
    id:"",
    startTime:"",
    canUseCard:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      id:options.id
    })
    getCardDetail({
      id: options.id
    }).then(res => {
      if(res){
        res.module = formatCouponsCardDesc(res.module)
        that.setData({
          coupons: res.module,
          startTime:res.module.vailyTime.split(" 至 ")[0]
        })
        that.canUse()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  canUse:function(){
    var that=this
    var nowTime=new Date();
    var cardTime = new Date(that.data.startTime);
    // console.log(nowTime < cardTime)
    if(nowTime<cardTime){
      that.setData({ canUseCard: false })
    } else{
      that.setData({ canUseCard: true })
    }
    // var nowYear = nowTime.getFullYear();
    // var nowMonth=nowTime.getMonth()+1;
    // var nowDate=nowTime.getDate();
    // console.log(nowYear + " " + nowMonth + " " + nowDate)

    // var cardYear = that.data.startTime.split("-")[0];
    // var cardMonth = that.data.startTime.split("-")[1].indexOf("0") == 0 ? that.data.startTime.split("-")[1].substring(1) : that.data.startTime.split("-")[1];
    // var cardDate = that.data.startTime.split("-")[2].indexOf("0") == 0 ? that.data.startTime.split("-")[2].substring(1) : that.data.startTime.split("-")[2];
    // console.log(cardYear + " " + cardMonth + " " + cardDate)

    // cardYear <= nowYear?
    //   cardMonth <= nowMonth?
    //     cardDate <= nowDate?
    //       console.log("可以") : that.setData({canUseCard:false})
    //       // console.log("天不可以")
    //     : that.setData({ canUseCard: false })
    //     // console.log("月不可以")
    //   : that.setData({ canUseCard: false })
      // console.log("年不可以")
  },
  useNow:function(){
    var that=this
    if(!that.data.canUseCard){
      wx.showToast({
        title: '该优惠券尚未达到使用时间',
        duration:2000,
        icon:"none"
      })
      return
    }
    if(that.data.id){
      wx.showModal({
        title: '提示',
        content: '您确定要使用该优惠券吗',
        success(res) {
          if (res.confirm) {
            decrypt({ id: that.data.id }).then(
            ).catch(err => {
              console.log(err)
            })
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
    }
  },
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