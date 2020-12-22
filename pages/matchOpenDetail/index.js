// pages/information/index.js
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableItemIndex: 1,
    orderNo: '',
    orderMoney: '',
    timestamp: '',
    invoiceTitleFlag: false,
    bankAccount: '',
    bankName: '',
    taxNumber: '',
    telephone: '',
    title: '',
    companyAddress:'',
    requestStatus: false,
    showMoreStatus: false,
    defaultEmail: '',
    titleItem: [],
    titleItemCover: false,
    orderSn: '',
    detail:{},
    uuid: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let params;
    // if (options.mchId) {
    //   this.mchId = options.mchId;
    //   params = {
    //     mchId: options.mchId,
    //     sign: options.sign,
    //     encryptData: options.encryptData,
    //   }
    // } 
    // this.params = params;
    // this.getMatchIdInformation(this.params);
  },
  getMatchIdInformation(option) {
    wx.request({
      url: api.toDecryptMerchantData(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        ...option,
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {
        const { data: { module } } = res;
        if (res.data.success) {
          if (module.uuid) {
            wx.redirectTo({
              url: `/pages/eInvoiceDetail/index?id=${module.uuid}`,
            })
          } else {
            const detail = module.title;
            detail.orderNo = module.order.orderNo;
            detail.amount = module.order.amount;
            detail.invoiceType = module.invoiceType;
            detail.orderTime = module.order.orderTime;
            detail.itemName = module.order.itemName;
            this.detail = detail; 
            this.order = module.order;
            this.setData({
              detail: detail,
              uuid: true,
            })
          }
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon:'none',
          })
        }
      }
    })
  },
  showMore() {
    this.setData({
      showMoreStatus: true,
    });
  },
  formSubmit1(res) {
    const { value, formId } = res.detail;
    conf.formSubmit({ formId, btnName: '申请开票' })
    if (!this.data.requestStatus) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        requestStatus: true,
      }); 
      value.order = JSON.stringify(this.order);
      this.openTicket(value);
    }
  },
  formSubmit2(res) {
    const { value, formId } = res.detail;
    conf.formSubmit({ formId, btnName: '申请开票' })
    if (!this.data.requestStatus) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        requestStatus: true,
      });
      value.order = JSON.stringify(this.order);
      this.openTicket(value);
    }
  },
  openTicket(options) {
    const { detail } = this.data;
    options.orderNo = this.detail.orderNo;
    options.session = wx.getStorageSync('sessionCode');
    // options.m_appId = 'TYDC0314185353100131',
    options.mchId = this.mchId,
    options.itemName = detail.itemName,
    options.amount = detail.amount,
    // options.code = '91110108MA00ADTE6A',
    wx.request({
      url: api.createAndInsertCardNew(),
      method: "POST",
      header: conf.getHeader(),
      data: options,
      success(res) {
        const { data } = res;
        wx.hideLoading();
        if (data.success == true) {
          wx.showToast({
            title: '开票成功',
            icon: 'success',
            duration: 2000,
          });
        }
        if (data.success == true && data.module && data.module.appid && data.module.authUrl){
          // wx.navigateToMiniProgram({
          //   appId: data.module.appid,
          //   path: data.module.authUrl,
          //   success(res) {
          //   }
          // })
          wx.navigateTo({
            url: `/pages/eInvoiceDetail/index?id=${data.module.uuid}`,
          })
        }
        if (data.success == false) {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000,
          });
        }
      },
      complete: (res) => {
        setTimeout(() => {
          this.setData({
            requestStatus: false,
          });
        }, 800)
      }
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
        this.getMatchIdInformation(this.params);
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
      },
      success: (response) => {
        const { data } = response;
        if (data.success == true) {
          const { session } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('deadline', new Date())
          this.getMatchIdInformation(this.params);
        }
      },
      complete: (res) => {
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { referrerInfo } = appInstance.matchData;
    let params;
    if (referrerInfo.extraData) {
      const { extraData: { data } } = referrerInfo;
      this.mchId = data.mchId;
      params = {
        mchId: data.mchId,
        sign: data.sign,
        encryptData: data.encryptData,
      }
    }
    this.params = params;
    this.sessionIsExpire();
  },
})