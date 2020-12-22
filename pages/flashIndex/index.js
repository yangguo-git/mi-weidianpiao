//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const {
  getUrlParams
} = require('../../utils/util.js');
const {
  scanGodown
} = require("../../utils/apiRequest.js");
var that;
Page({
  data: {
    invoiceList: [],
    selectIndex: 'null',
    appId: '',
    shopName: '',
    selectTypeIndex: 3,
    logUrl: "",
    canOpenType: 3,
    qrCodeParam: '',
    isCanSubmit: false,
  },
  onLoad: function (options) {
    that = this;
    const {
      m_appId,
      q
    } = options;
    console.log('options',options)
    this.appId = m_appId;
    if (m_appId) {
      wx.navigateTo({
        url: `../merchant_home/merchant_home?m_appId=${m_appId}`,
      })
    }
    if (q) {
      const urlStr = decodeURIComponent(q);
      if (urlStr.indexOf("?") != -1) {
        const params = urlStr.split("?")[1];
        wx.navigateTo({
          url: `../merchant_home/merchant_home?q=${encodeURIComponent('?' + params)}`,
        })
      }
    }

  },
  selectEvent(e) {
    const {
      index,
      selectStatus
    } = e.detail;
    const {
      selectIndex
    } = this.data;
    if (!selectStatus && selectIndex == index) {
      this.setData({
        selectIndex: 'null',
      });
    } else {
      this.setData({
        selectIndex: index,
      });
    }
  },

  nav_myCoupons() {
    wx.navigateTo({
      url: '../myCoupons/myCoupons',
    })
  },
  addInvoice(e) {
    const {
      formId
    } = e.detail;
    conf.formSubmit({
      formId,
      btnName: '提交'
    })
    const {
      selectIndex,
      selectTypeIndex
    } = this.data;
    if (selectIndex == 'null') {
      wx.showToast({
        title: '请选择发票抬头',
        icon: 'none',
      })
    } else if (selectTypeIndex == 3) {
      wx.showToast({
        title: '请选择发票据类型',
        icon: 'none',
      })
    } else {
      this.postOpenInvoiceTitle();
    }
  },
  postOpenInvoiceTitle() {
    if (this.openRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.openRequestFlag = true;
    const {
      selectIndex,
      invoiceList
    } = this.data;
    const item = invoiceList[selectIndex];
    let params = {};
    if (item.type == 0) {
      params.session = wx.getStorageSync('sessionCode');
      params.mobilePhone = item.mobilePhone;
      params.email = item.email ? item.email : '';
      params.name = item.name;
      params.type = item.type;
      params.appId = this.data.appId;
      params.fastType = this.data.selectTypeIndex;
    }
    if (item.type == 1) {
      params.session = wx.getStorageSync('sessionCode');
      params.email = item.email ? item.email : '';
      params.name = item.name;
      params.type = item.type;
      params.taxId = item.taxId;
      params.bank = item.bank;
      params.account = item.account;
      params.address = item.address;
      params.telephone = item.telephone;
      params.mobilePhone = item.mobilePhone;
      params.appId = this.data.appId;
      params.fastType = this.data.selectTypeIndex;
    }
    wx.request({
      url: api.postOpenTicket(),
      data: params,
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const {
          module,
          success
        } = res.data;
        if (success) {
          if (success && module.fastType === 0) {
            wx.navigateTo({
              // url: `/pages/eInvoiceDetail/index?id=${module.uuid}`,
              url: `/pages/openning/index?params=${encodeURIComponent(JSON.stringify(params))}&id=${module.uuid}`
            })
          } else if (success && module.fastType === 1) {
            wx.navigateTo({
              // url: `/pages/openning/index?params=${encodeURIComponent(JSON.stringify(params))}&id=${module.uuid}`,
              url: `/pages/processed/index?enterType=1&orderId=${module.reqNo}&appId=${this.data.appId}&jumpData=${encodeURIComponent(JSON.stringify(module))}`
            })
          } else {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
        // if (success && module.fastType === 0) {
        //   wx.navigateTo({
        //     url: `/pages/eInvoiceDetail/index?id=${module.uuid}`,
        //   })
        // } else if (success && module.fastType === 1) {
        //   wx.navigateTo({
        //     url: `/pages/openning/index?params=${encodeURIComponent(JSON.stringify(params))}`,
        //   })
        // } else {
        //   wx.showToast({
        //     title: res.data.errorMsg,
        //     icon: 'none',
        //   })
        // }
      },
      complete: (res) => {
        setTimeout(() => {
          wx.hideLoading();
          this.openRequestFlag = false;
        }, 600)
      },
    })
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
    wx.request({
      url: api.login(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        code: code,
        minipId: api.minipId
      },
      success: (response) => {
        const {
          data
        } = response;
        if (data.success == true) {
          const {
            session
          } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('deadline', new Date())
          this.getInvoiceTitleList();
          if (this.appId || this.qrCodeParam) {
            this.getInvoiceShopInfo();
          }
          // setTimeout(() => {
          //   const url = `${api.getCodeImage()}?session=${session}&v=${Math.random()}`;
          //   this.setData({
          //     codeImageUrl: url,
          //   })
          // }, 100);
        }
      },
      complete: (res) => {}
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
        const {
          module,
          success
        } = res.data;
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
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  onHide: function () {
    this.setData({
      my_swiper_show: false
    })
  },
  onShow: function () {
    this.setData({
      my_swiper_show: true
    })
    this.sessionIsExpire();
  },
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log('11111111111111', res);
        const {
          path,
          result
        } = res;
        if (path && path.indexOf('m_appId=') > 0) {
          // 商户二维码进入商户首页
          const params = path.split("?")[1];
          wx.navigateTo({
            url: `../merchant_home/merchant_home?${params}`,
          })
        } else if (path && path.indexOf('scene=') > 0) {
          // 审核二维码进入优惠券审核页面
          const params = path.split("?")[1];
          wx.reLaunch({
            url: `../couponsAudit/couponsAudit?${params}`
          })
        } else if (result) {
          console.log('22222222222222222222222222222')
          // 未知
          if (result.indexOf("?") != -1) {
            const params = result.split("?")[1];
            // wx.reLaunch({
            //   url: `/pages/flashIndex/index?q=${encodeURIComponent('?' + params)}`,
            // })
            wx.navigateTo({
              url: `../merchant_home/merchant_home?q=${encodeURIComponent('?' + params)}`,
            })
          }
        }
      }
    })
  },
  toMyInvoice() {
    // wx.showToast({
    //   title: '即将开放，敬请期待！',
    //   icon:'none',
    // })
    wx.navigateTo({
      url: '/pages/myInvoice/index',
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
        const {
          success,
          module,
          errorMsg
        } = res.data;
        if (success && module) {

          this.setData({
            isCanSubmit: true,
            shopName: module.shopName,
            appId: module.appId,
            logUrl: module.logUrl,
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
  selectTypeEvent(e) {
    const {
      index
    } = e.detail;
    this.setData({
      selectTypeIndex: index,
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '微电票小程序',
      path: '/pages/flashIndex/index',
      imageUrl: '/images/share.jpg'
    }
  }
})