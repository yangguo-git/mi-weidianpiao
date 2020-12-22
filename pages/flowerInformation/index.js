// pages/information/index.js
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
const appInstance = getApp()
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getInvoiceTitle();
    this.sessionIsExpire();
    if (options.appId) {
      this.setData({
        appId: options.appId,
        orderSn: options.orderNo || '',
      });
      this.appId = options.appId;
      this.getTestOrderInfo();
      this.getLastTitle();
    } else {
      const data = JSON.parse(decodeURIComponent(options.query));
      const {
        orderNo,
        orderMoney,
        timestamp,
        defaultEmail,
        bank,
        companyNo,
        companyName,
        account,
      } = data;
      const formatedDate = timestamp.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5:$6');
      this.setData({
        orderNo,
        orderMoney: conf.formatPrice(orderMoney),
        timestamp: formatedDate,
        defaultEmail: defaultEmail ? defaultEmail : '',
        bankName: bank ? bank : '',
        taxNumber: companyNo ? companyNo : '',
        bankAccount: account ? account : '',
        title: companyName ? companyName : '',
      });
    }
  },
  getTestOrderInfo() {
    wx.request({
      url: api.getTestOrderInfo(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        session: wx.getStorageSync('sessionCode'),
      },
      success: (response) => {
        const { data } = response;
        if (data.success == true) {
          console.log(data);
          const { module: { amount, orderNo} } = data;
          this.setData({
            orderMoney: amount,
            orderSn: orderNo,
          })
        }
      },
      complete: (res) => {
      }
    })
  },
  getLastTitle() {
    wx.request({
      url: api.getLastTitle(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        session: wx.getStorageSync('sessionCode'),
      },
      success: (response) => {
        const { data } = response;
        if (data.success == true) {
          const { module: { type, name, taxId } } = data;
          this.setData({
            title: name,
            taxNumber: taxId ? taxId : '',
            tableItemIndex: type === 0 ? 2 : 1,
          })
        }
      },
      complete: (res) => {
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
        this.setData({
          titleItem: module,
        })
      }
    })
  },
  hideCover(res){
    const { id } = res.target;
    if (id != "titleItem") {
      this.setData({
        titleItemCover: true,
      });
    }
  },
  selectIvoiceItem(e) {
    const { index } = e.currentTarget.dataset;
    const selectData = this.data.titleItem[index];
    this.setData({
      titleItemCover: true,
      bankName: selectData.bank,
      taxNumber: selectData.taxId,
      bankAccount: selectData.bankAccount,
      title: selectData.name,
    });
  },
  inputEvent(e) {
    const { value } = e.detail;
    this.getInvoiceTitle(value);
    this.setData({
      titleItemCover: false,
      bankName: '',
      taxNumber: '',
      bankAccount: '',
    });
  },
  tableEvent(res) {
    const { index } =  res.currentTarget.dataset;
    this.setData({
      tableItemIndex: index,
    });
  },
  getInvoiceTitle(option) {
    wx.request({
      url: api.getInvoiceTitle(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        t: option,
        a: 0,
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {
        const { data: { module} } = res;
        this.setData({
          titleItem: module,
        })
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
    conf.formSubmit({ formId, btnName: '花店申请开票' })
    if (value.name == '') {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // if (value.email == '') {
    //   wx.showToast({
    //     title: '请输入邮箱',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   value.email = this.data.defaultEmail;
    // }
    if (value.email != '') {
      const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!pattern.test(value.email)) {
        wx.showToast({
          title: '你输入的邮箱有误！',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
    }
    if (value.code == '') {
      wx.showToast({
        title: '请输入税号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (value.mobile != '') {
      if (!reg.test(value.mobile)) {
        wx.showToast({
          title: '手机号码输入有误，请确认',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
    }
    value.session = wx.getStorageSync('sessionCode');
    value.orderNo = this.data.orderNo;
    if (!this.data.requestStatus) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        requestStatus: true,
      });
      this.openTicket(value);
    }
  },
  formSubmit2(res) {
    const { value, formId } = res.detail;
    conf.formSubmit({ formId, btnName: '花店申请开票' })
    if (value.name == '') {
      wx.showToast({
        title: '请输入名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // if (value.email == '') {
    //   wx.showToast({
    //     title: '请输入邮箱',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   value.email = this.data.defaultEmail;
    // }
    if (value.email != ''){
      const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!pattern.test(value.email)) {
        wx.showToast({
          title: '你填写的邮箱有误！',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
    }
    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (value.mobile != ''){
      if (!reg.test(value.mobile)) {
        wx.showToast({
          title: '手机号码输入有误，请确认',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
    }
    value.session = wx.getStorageSync('sessionCode');
    value.orderNo = this.data.orderNo;
    if (!this.data.requestStatus) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        requestStatus: true,
      });
      this.openTicket(value);
    }
  },
  openTicket(options) {
    if(this.appId) {
      options.orderNo = this.data.orderSn;
      options.m_appId = this.appId;
    }
    wx.request({
      url: api.openTicketAndEnpower(),
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
  invoiceTitle() {
    wx.getSetting({
      success:(res) => {
        if (!res.authSetting['scope.invoiceTitle']) {
          wx.authorize({
            scope: 'scope.invoiceTitle',
            success:(res) => {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              this.selectinvoiceTitle();
            },
            fail:(res) => {
              this.setData({
                invoiceTitleFlag: true,
              });
            }
          })
        } else {
          this.selectinvoiceTitle();
        }
      }
    })
  },
  opensetting(res) {
    const { authSetting } = res.detail;
    if (authSetting['scope.invoiceTitle']) {
      this.setData({
        invoiceTitleFlag: true,
      });
      this.selectinvoiceTitle();
    }
  },
  selectinvoiceTitle() {
    wx.chooseInvoiceTitle({
      success: (res) => {
        const { bankAccount, bankName, taxNumber, telephone, title, companyAddress } = res;
        this.setData({
          bankAccount,
          bankName,
          taxNumber,
          telephone,
          title,
          companyAddress,
        })
      }
    })
  },
})