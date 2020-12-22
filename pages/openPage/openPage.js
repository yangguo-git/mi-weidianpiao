//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const { getUrlParams } = require('../../utils/util.js');

Page({
  data: {
    invoiceList: [],
    selectIndex: 'null',
    appId: '',
    shopName: '',
    fastType:0,
    selectTypeIndex: wx.getStorageSync('selectTypeIndex')?wx.getStorageSync('selectTypeIndex'):0,
    logUrl: "",
    canOpenType: 3,
    qrCodeParam: '',
    isCanSubmit: false,
  },
  onLoad: function (options) {
    const { m_appId, q } = options;
    this.appId = m_appId;
    if (m_appId) {
      this.setData({
        appId: m_appId,
      });
    }
    if (q) {
      const urlStr = decodeURIComponent(q);
      if (urlStr.indexOf("?") != -1) {
        const url = urlStr.split("?")[1];
        const str = getUrlParams(url);
        this.qrCodeParam = str.i;
        this.setData({
          qrCodeParam: str.i,
        })
      }
    }
  },
  selectEvent(e) {
    const { index, selectStatus } = e.detail;
    const { selectIndex } = this.data;
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
  addInvoice(e) {
    console.log('提交后点击确定  ------addInvoice')
    if (e && e.detail && e.detail.formId) {
      const { formId } = e.detail;
      conf.formSubmit({ formId, btnName: '提交' })
      this.setData({
        invoiceCover: true
      })
      return
    }
    const { selectIndex, selectTypeIndex } = this.data;
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

  // 提交后点击编辑
  navDetail() {
    var data = JSON.stringify(this.data.invoiceList[this.data.selectIndex]);
    console.log('data', data)
    wx.navigateTo({
      url: `/pages/detail/index?detail=${data}&ly_openPage=true`,
    })
  },
  // 提交后点击确定提交
  invoiceCoverSubmit() {
    console.log('提交后点击确定')
    this.addInvoice()
    this.setData({
      invoiceCover: false
    })
  },
  addInvoice(e) {
    console.log('提交后点击确定  ------addInvoice')
    if (e && e.detail && e.detail.formId) {
      const { formId } = e.detail;
      conf.formSubmit({ formId, btnName: '提交' })
      this.setData({
        invoiceCover: true
      })
      return
    }
    const { selectIndex, selectTypeIndex } = this.data;
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
    // wx.showLoading({
    //   title: '加载中...',
    // })
    this.openRequestFlag = true;
    const { selectIndex, invoiceList } = this.data;
    const item = invoiceList[selectIndex];
    let params = {};
    // item.type == 0 抬头信息是电票还是纸票
    // selectTypeIndex 票据类型 电子发票类型 0 纸质发票 1
    if (item.type == 0) {
      params.session = wx.getStorageSync('sessionCode');
      params.mobilePhone = item.mobilePhone;
      params.email = item.email;
      params.name = item.name;
      params.type = item.type;
      params.appId = this.data.appId;
      params.fastType = this.data.selectTypeIndex||0;
    }
    if (item.type == 1) {
      params.session = wx.getStorageSync('sessionCode');
      params.email = item.email;
      params.name = item.name;
      params.type = item.type;
      params.taxId = item.taxId;
      params.bank = item.bank;
      params.account = item.account;
      params.address = item.address;
      params.telephone = item.telephone;
      params.mobilePhone = item.mobilePhone;
      params.appId = this.data.appId;
      params.fastType = this.data.selectTypeIndex||0;
    }
    wx.request({
      url: api.postOpenTicket(),
      data: params,
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { module, success } = res.data;
        if(success){
          wx.requestSubscribeMessage({
            tmplIds: ['X8Qfky5bA8fjkbk-cRwfdQzylfpAIYddJDd1X4jVlB8','qf3ueoAZL-LCHS-qHlcWdEivmwM7c8v-VTTQJw5P1Q4','ltLPoxzFjuRtV-S8hFFCmuy6yOSx5q5o1yqlMRFaaaA'],
            success (res) { },fail(err){
            }
      
          })
        }
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
      },
      complete: (res) => {
        setTimeout(() => {
          // wx.hideLoading();
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
        const { data } = response;
        if (data.success == true) {
          const { session } = data.module;
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
  onHide: function () {
    this.setData({
      my_swiper_show: false
    })
  },
  onShow: function () {
    this.setData({
      invoiceCover: false,
      my_swiper_show: true
    })
    this.sessionIsExpire();
  },
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res);
        const { path, result } = res;
        if (path && path.indexOf('m_appId=')) {
          // wx.reLaunch({
          //   url: `/${res.path}`,
          // })
          const params = path.split("?")[1];
          wx.navigateTo({
            url: `../merchant_home/merchant_home?${params}`,
          })
        } else if (!path && result) {

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
        const { success, module, errorMsg } = res.data;
        if (success && module) {
          let selectTypeIdx = 3;
          if(module.fastType==2){
            selectTypeIdx = wx.getStorageSync('selectTypeIndex')
          }else if(module.fastType==1){
            selectTypeIdx = 1
          }else{
            selectTypeIdx=0
          }
          this.setData({
            isCanSubmit: true,
            shopName: module.shopName,
            appId: module.appId,
            logUrl: module.logUrl,
            canOpenType: module.fastType,
            selectTypeIndex: selectTypeIdx,
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
    const { index } = e.detail;
    wx.setStorageSync('selectTypeIndex', index)
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
