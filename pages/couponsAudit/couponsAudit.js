const {
  formatCouponsCardAduit
} = require("../../utils/util.js")
const {
  auditList,
  scanGodown,
  isBind,
  isAudit,
  removeBind,
  releaseCard
} = require("../../utils/apiRequest.js")
const cardList = []
const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const { getUrlParams } = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCheck: false,
    list: [],
    checkCount: 0,
    tableCard:"",
    isAudit:false,
    // coupons: [{
    //     cardCheck: true,
    //     id: '1',
    //     title: "海底捞火锅（西直门店）",
    //     type: "DISCOUNT",
    //     value: "9.5折",
    //     vailyTime: "2017-07-02至2019-12-03",
    //     totalQuantity: 500,
    //     receiveCount: 0
    //   },
    //   {
    //     cardCheck: true,
    //     id: '2',
    //     title: "海底捞火锅（西直门店）",
    //     type: "DISCOUNT",
    //     value: "9.5折",
    //     vailyTime: "2017-07-02至2019-12-03",
    //     totalQuantity: 500,
    //     receiveCount: 0
    //   },
    //   {
    //     cardCheck: false,
    //     id: '3',
    //     title: "海底捞火锅（西直门店）",
    //     type: "DISCOUNT",
    //     value: "9.5折",
    //     vailyTime: "2017-07-02至2019-12-03",
    //     totalQuantity: 500,
    //     receiveCount: 0
    //   },
    //   {
    //     cardCheck: true,
    //     id: '4',
    //     title: "路边米线",
    //     type: "DONATE",
    //     value: "赠品",
    //     vailyTime: "2017-07-02至2019-12-03",
    //     totalQuantity: 500,
    //     receiveCount: 0
    //   }
    // ],
    coupons: [],
    disabled: true,
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // that.enterAuditCode()
    console.log("优惠券审核")
    // scanGodown({ "tableCard": wx.getStorageSync("tableCard") }).then().catch(err => console.log(err))
    console.log(options)
    if(options.scene){
      var tc = decodeURIComponent(options.scene).split("=")[1]
      console.log(tc)
      wx.setStorageSync("tableCard", tc)
    }
  },
  enterAuditCode: function() {
    var that=this
    isBind({
      "tableCard": wx.getStorageSync("tableCard")
    }).then(res => {
      console.log("isBind")
      if (res.module === 1) {
        isAudit({
          "tableCard": wx.getStorageSync("tableCard")
        }).then(res => {
          console.log("isAudit")
          if (res.module === 1) {
            console.log("auditList")
            that.auditList()
          } else {
            // wx.showLoading({
            //   title: '加载中'
            // })
            wx.showToast({
              title: '无审核权限',
              duration: 2000,
              icon: 'none'
            })
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/flashIndex/index'
              })
            },2000)
          }
        }).catch(err => console.log(err))
      } else if (res.module === 2) {
        wx.navigateTo({
          url: '/pages/bindAuditor/bindAuditor'
        })
      }else{
        wx.showToast({
          title: '无效的审核码',
          duration: 2000,
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/flashIndex/index'
          })
        }, 2000)
      }
    }).catch(err => console.log(err))
  },
  auditList: function() {
    var that = this
    auditList({
      "tableCard": wx.getStorageSync("tableCard")
    }).then(res => {
      console.log(res)
      if (res.module.length === 0 || cardList.length < 1) {
        that.setData({
          disabled: true,
          isAudit:true
        })
      }
      that.setData({
        coupons: formatCouponsCardAduit(res.module)
        //  coupons: res.module
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // init: function() {
  //   var that = this
  //   that.setData({
  //     coupons: formatCouponsCard(that.data.coupons)
  //   })
  // },
  goToDesc: function(e) {
    var that = this
    console.log(e.target.id)
    wx.navigateTo({
      url: '/pages/couponsAuditDesc/couponsAuditDesc?id=' + e.target.id
    })
  },
  removeBind: function() {
    wx.showModal({
      title: '解除绑定',
      content: '解除该微信帐号绑定权限',
      success(res) {
        if (res.confirm) {
          removeBind({
            "tableCard": wx.getStorageSync("tableCard")
          }).then(
            wx.redirectTo({
              url: '/pages/unBindSuccess/unBindSuccess',
            })
          ).catch()
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消操作',
            duration: 2000,
            icon: 'none'
          })
        }
      }
    })
  },
  allCheck: function() {
    var _this = this
    _this.setData({
      allCheck: !_this.data.allCheck,
    })
    // console.log(_this.data.allCheck)
    _this.data.coupons.forEach((val, index) => {
      // console.log(index)
      var cardCheck = 'coupons[' + index + '].cardCheck'
      _this.setData({
        [cardCheck]: _this.data.allCheck
      })
    })
    if (_this.data.allCheck) {
      cardList.splice(0, cardList.length)
      _this.data.coupons.forEach((val, index) => {
        cardList.push(val.reviewRecoedId.toString())
      })
    } else {
      cardList.splice(0, cardList.length)
    }
    // console.log(cardList)
    _this.setData({
      list: cardList
    })
    if (cardList.length > 0) {
      _this.setData({
        disabled: false
      })
    } else {
      _this.setData({
        disabled: true
      })
    }
  },
  onCheckCardSend: function(e) {
    // console.log(e.detail.cardCheck)
    var _this = this
    _this.data.coupons.forEach((val, index) => {
      if (val.id.toString() === e.target.id) {
        if (!e.detail.cardCheck) {
          // console.log(cardList.indexOf(e.target.id))
          cardList.splice(cardList.indexOf(e.detail.reviewRecoedId), 1)
        } else if (cardList.indexOf(e.detail.reviewRecoedId) === -1) {
          cardList.push(e.detail.reviewRecoedId)
        }
      }
    })
    // console.log(cardList)
    _this.setData({
      checkCount: cardList.length,
      list: cardList
    })
    if (cardList.length > 0) {
      _this.setData({
        disabled: false
      })
    } else {
      _this.setData({
        disabled: true
      })
    }
    this.getCheckCount()
  },
  getCheckCount: function() {
    var _this = this
    if (_this.data.checkCount === _this.data.coupons.length) {
      _this.setData({
        allCheck: true
      })
    } else {
      _this.setData({
        allCheck: false
      })
    }
  },
  releaseCard: function() {
    var that = this
    console.log(that.data.list)
    if (that.data.list) {
      console.log(JSON.stringify(that.data.list))
      wx.showModal({
        title: '发布优惠券',
        content: '本次审核通过' + that.data.list.length + '批优惠券',
        success(res) {
          if (res.confirm) {
            releaseCard({
              "list": JSON.stringify(that.data.list)
            }).then(
              () => {
                wx.showToast({
                    title: '已成功发布',
                    duration: 2000,
                    icon: 'none'
                  }),
                  that.setData({
                    disabled: true,
                    list: that.data.list.splice(0, that.data.list.length)
                  }),
                  cardList.splice(0, 1),
                  that.auditList()
              }
            ).catch()
          } else if (res.cancel) {
            wx.showToast({
              title: '已取消发布',
              duration: 2000,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  getUserInfo: function (e) {
    var that = this
    console.log(e)
    app.globalData.userAllInfo = e.detail
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      that.setData({
        hasUserInfo: false
      })
    }
    that.sessionIsExpire()
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
        // setTimeout(() => {
        //   const url = `${api.getCodeImage()}?session=${wx.getStorageSync('sessionCode')}&v=${Math.random()}`;
        //   this.setData({
        //     // codeImageUrl: api.getCodeImage()+'?session='+Math.random(),
        //     codeImageUrl: url,
        //   })
        // }, 50);
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
    var that=this
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
          wx.setStorageSync('deadline', new Date())
          this.getInvoiceTitleList();
          if (this.appId || this.qrCodeParam) {
            this.getInvoiceShopInfo();
          }
          if(session){
            that.enterAuditCode()
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
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                hasUserInfo: true
              })
              if(that.data.hasUserInfo){
                console.log("2")
                that.enterAuditCode()
              }
              // console.log(res)
              app.globalData.userAllInfo = res
              console.log(app.globalData.userAllInfo)
              that.sessionIsExpire()
            },
            fail: function (res) {
              console.log(fail)
              return
            }
          })
        } else {
          that.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },
  closeModal: function (e) {
    var that = this;
    that.setData({
      hasUserInfo: true
    })
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