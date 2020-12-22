//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');

Page({
  data: {
    orderSn: '',
    verifyCode: '',
    codeImageUrl: '', 
    requestStatus: false,
    appId: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    if (options.appId) {
      this.setData({
        appId: options.appId,
      })
    }
    this.sessionIsExpire();
  },
  sessionIsExpire(){
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
        setTimeout(() => {
          const url = `${api.getCodeImage()}?session=${wx.getStorageSync('sessionCode')}&v=${Math.random()}`;
          this.setData({
            // codeImageUrl: api.getCodeImage()+'?session='+Math.random(),
            codeImageUrl: url,
          })
        }, 50);
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
        const { data } = response;
        if (data.success == true) {
          const { session } = data.module;
          wx.setStorageSync('sessionCode', session);
          wx.setStorageSync('deadline', new Date())
          setTimeout(() => {
            const url = `${api.getCodeImage()}?session=${session}&v=${Math.random()}`;
            this.setData({
              codeImageUrl: url,
            })
          }, 100);
        }
      },
      complete: (res) => {
      }
    })
  },
  orderSnChange(res) {
    const {
      value
    } = res.detail;
    this.setData({
      orderSn: value,
    })
  },
  verifyCodeChange(res) {
    const {
      value
    } = res.detail;
    this.setData({
      verifyCode: value,
    })
  },
  getImageCode() {
    this.setData({
      codeImageUrl: '',
    })
    setTimeout(() => {
      const url = `${api.getCodeImage()}?session=${wx.getStorageSync('sessionCode')}&v=${Math.random()}`;
      this.setData({
        codeImageUrl: url,
      })
    }, 50);
  },
  openTicket(e) {
    const { formId } = e.detail;
    conf.formSubmit({ formId, btnName: '申请开票' })
    const {
      orderSn
    } = this.data;
    const {
      verifyCode
    } = this.data;
    if (orderSn == '') {
      wx.showToast({
        title: '请填写订单号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (verifyCode == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.requestStatus) {
      wx.showLoading({
        title: '加载中',
      })
      this.trackOrder();
      this.setData({
        requestStatus: true,
      });
    }
  },
  trackOrder() {
    console.log('查询订单')
    const session = wx.getStorageSync('sessionCode');
    const { orderSn, verifyCode } = this.data;
    wx.request({
      url: api.trackOrder(),
      method: "POST",
      header: conf.getHeader(),
      data:{
        orderNo: orderSn,
        scode: verifyCode,
        session,
      },
      success:(res) => {
        const { data } = res;
        wx.hideLoading();
        this.setData({
          requestStatus: false,
        });
        if (data.success == true && data.module && data.module.code == 0 ) {
          const { module } = data;
          const query = encodeURIComponent(JSON.stringify(module));
          wx.navigateTo({
            url: `/pages/flowerInformation/index?query=${query}`,
          })
        }
        if (data.success == false) {
          wx.showToast({
            title: data.errorMsg,
            icon: 'none',
            duration: 2000
          })
        }
        if (data.success == true && data.module && data.module.code != 0) {
          wx.showToast({
            title: data.module.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete:() => {
        this.setData({
          requestStatus: false,
        });
        // wx.hideLoading();
      }
    })
  },
  openTicketTest(e) {
    const { formId } = e.detail;
    conf.formSubmit({ formId, btnName: '申请开票' })
    const {
      orderSn,
      verifyCode
    } = this.data;
    if (orderSn == '') {
      wx.showToast({
        title: '请填写订单号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (verifyCode == '') {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/flowerInformation/index?appId=${this.data.appId}&orderNo=${orderSn}`,
    })
  },
  onShow() {
    if (wx.getStorageSync('sessionCode')) {
      this.getImageCode();
    } else {
        this.login();
    }
  }
})