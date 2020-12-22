// pages/detail/index.js
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mm_bg: true,
    tableList: ['单位', '个人'],
    activeIndex: 0,
    invoiceTitleFlag: false,
    address: '',
    account: '',
    bank: '',
    email: '',
    name: '',
    telephone: '',
    mobilePhone: '',
    taxId: '',
    detail: null,
    type: 0,
    appId: '',
    editData: '',
    selectTypeIndex: 3,
    shopName: '',
    canOpenType: 3,
    logUrl: "",
    isCanSubmit: false,
    enterInfo: {},
    invoiceCover: false,
  },
  hide_mm_bg() {
    this.setData({
      mm_bg: false
    })
  },
  onShow(){
    // if (this.data.mm_bg) {
    //   this.hide_mm_bg();
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that =this;
    this.login()
    this.authorize();
    const {
      detail,
      appId,
      ly_openPage
    } = options;
    if (ly_openPage) {
      this.setData({
        ly_openPage
      })
    }
    this.detail = detail;
    this.appId = appId;
    if (detail) {
      const data = JSON.parse(decodeURIComponent(detail))
      this.invoiceInfo = data;
      let activeIndex = 0;
      let tableList = [];
      if (data.type == 0) {
        activeIndex = 1;
        tableList = ['个人'];
      } else if (data.type == 1) {
        activeIndex = 0;
        tableList = ['单位'];
      }
      this.setData({
        detail: data,
        activeIndex,
        tableList,
        editData: data,
        mobilePhone: data.mobilePhone,
        // type: data
      })
    }
    if (appId) {
      this.getInvoiceShopInfo(appId)
      this.setData({
        appId,
      })
    }
  },

  getInvoiceShopInfo(appId) {
    wx.request({
      url: api.getInvoiceShopInfo(),
      data: {
        appId,
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const {
          success,
          module
        } = res.data;
        if (success) {
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
            logUrl: module.logUrl,
            canOpenType: module.fastType,
            selectTypeIndex: selectTypeIdx
          })
        }
      },
    })
  },

  tableEvent(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
    });
  },
  companySave(options) {
    const {
      detail
    } = options;
    conf.formSubmit({
      formId: detail.formId,
      btnName: '保存'
    })
    if (this.detail) {
      detail.titleId = this.invoiceInfo.id;
      this.postEditenvoiceTitle(detail);
    } else {
      this.postAddInvoiceTitle(detail);
    }
  },
  companySubmit(options) {
    const {
      detail
    } = options;
    this.setData({
      enterInfo: detail,
      invoiceCover: true,
    })
    conf.formSubmit({
      formId: detail.formId,
      btnName: '提交'
    })
    // if (this.appId) {
    //   detail.appId = this.appId;
    //   detail.fastType = this.data.selectTypeIndex;
    //   this.postOpenTicket(detail);
    // }
  },
  hideInvoiceCover() {
    this.setData({
      // enterInfo: detail,
      invoiceCover: false,
    })
  },

  invoiceCoverSubmit() {
    const detail = this.data.enterInfo;
    if (this.detail) {
      detail.titleId = this.invoiceInfo.id;
      this.postEditenvoiceTitle(detail);
    } else {
      this.postAddInvoiceTitle(detail);
    }
  },

  personSave(options) {
    const {
      detail
    } = options;
    conf.formSubmit({
      formId: detail.formId,
      btnName: '保存'
    })
    if (this.detail) {
      detail.titleId = this.invoiceInfo.id;
      this.postEditenvoiceTitle(detail);
    } else {
      this.postAddInvoiceTitle(detail);
    }
  },
  personSubmit(options) {
    const {
      detail
    } = options;
    conf.formSubmit({
      formId: detail.formId,
      btnName: '提交'
    })
    if (this.appId) {
      detail.appId = this.appId;
      detail.fastType = this.data.selectTypeIndex;
      this.postOpenTicket(detail);
    }
    if (this.detail) {
      detail.titleId = this.invoiceInfo.id;
      this.postEditenvoiceTitle(detail);
    } else {
      this.postAddInvoiceTitle(detail);
    }
  },
  postOpenTicket(params) {
    if (this.openRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.openRequestFlag = true;
    params.session = wx.getStorageSync('sessionCode');
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
        if (success && module.fastType === 0) {
          wx.navigateTo({
            url: `/pages/eInvoiceDetail/index?id=${module.uuid}`,
          })
        } else if (success && module.fastType === 1) {
          wx.navigateTo({
            // url: `/pages/openning/index?params=${encodeURIComponent(JSON.stringify(params))}&id=${module.uuid}`,
            url: '/pages/processed/index'
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
          wx.hideLoading();
          this.openRequestFlag = false;
        }, 600)
      },
    })
  },
  postEditenvoiceTitle(options) {
    if (this.editRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.editRequestFlag = true;
    wx.request({
      url: api.updateInvoiceTitle(),
      data: {
        session: wx.getStorageSync('sessionCode'),
        ...options,
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            invoiceCover: false,
          })
          wx.showToast({
            title: '保存成功',
            image: '/images/gou.png',
          })
          setTimeout(() => {
            // wx.reLaunch({
            //   url: `/pages/flashIndex/index${this.appId ? '?m_appId=' + this.appId : ''}`,
            // })
            wx.navigateBack({
              delta: 2
            })
            // if (this.data.ly_openPage) {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }
            this.openRequestFlag = false;
          }, 600)
        }
        if (!res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
      },
      complete: (res) => {
        setTimeout(() => {
          wx.hideLoading();
          this.editRequestFlag = false;
        }, 400)
      },
    })
  },
  postAddInvoiceTitle(options) {
    if (this.addRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.addRequestFlag = true;
    wx.request({
      url: api.postAddInvoiceTitle(),
      data: {
        session: wx.getStorageSync('sessionCode'),
        ...options,
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            invoiceCover: false,
          })
          wx.showToast({
            title: '保存成功',
            image: '/images/gou.png',
          })
          setTimeout(() => {
            // wx.reLaunch({
            //   url: `/pages/flashIndex/index${this.appId ? '?m_appId=' + this.appId : ''}`,
            // })
            wx.navigateBack({
              delta: 1
            })
            // if (this.data.ly_openPage) {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }
            this.openRequestFlag = false;
          }, 600)
        }
        if (!res.data.success && !this.appId) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
        if (!res.data.success) {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none',
          })
        }
      },
      complete: (res) => {
        setTimeout(() => {
          wx.hideLoading();
          this.addRequestFlag = false;
        }, 400)
      },
    })
  },
  invoiceTitle() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.invoiceTitle']) {} else {
          this.selectinvoiceTitle();
        }
      }
    })
  },
  authorize() {
    wx.authorize({
      scope: 'scope.invoiceTitle',
      success: (res) => {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        // this.selectinvoiceTitle();
      },
      fail: (res) => {
        this.setData({
          invoiceTitleFlag: true,
        });
      }
    })
  },
  opensetting(res) {
    this.hide_mm_bg();
    wx.getSetting({
      success(res) {
        console.log('res', res)
        if (res.authSetting['scope.invoiceTitle']) {
          that.setData({
            invoiceTitleFlag: true,
          });
          that.selectinvoiceTitle();
        }
      }
    })
  },
  selectinvoiceTitle() {
    wx.chooseInvoiceTitle({

      success: (res) => {
        const {
          bankAccount,
          bankName,
          taxNumber,
          telephone,
          title,
          companyAddress,
          type
        } = res;
        const options = {};
        const {
          detail
        } = this.data;
        options.name = title;
        options.taxId = taxNumber;
        options.bank = bankName;
        options.account = bankAccount;
        options.address = companyAddress;
        options.telephone = telephone;
        options.mobilePhone = detail ? detail.mobilePhone : '';
        if (type == 0) {
          options.type = 1
        }
        if (type == 1) {
          options.type = 0;
        }
        if (detail && detail.type != options.type) {
          wx.showModal({
            title: '提示',
            content: `此抬头为${type == 0 ? '单位' : '个人'}抬头，是否重新同步?`,
            showCancel: true,
            success: (res) => {
              if (res.confirm) {
                this.selectinvoiceTitle();
              }
            },
          })
          return;
        }
        const condition = detail && ((detail.type == 0 && detail.name == title) || (detail.type == 1 && (detail.name == title || detail.taxId == taxNumber)));
        if (condition) {
          wx.showModal({
            title: '提示',
            content: `已有该发票抬头信息，是否同步？`,
            showCancel: true,
            success: (res) => {
              if (res.confirm) {
                this.setInvoiceData(options);
              }
            },
          })
        }
        if (!condition) {
          this.setInvoiceData(options);
        }
        this.setData({
          activeIndex: type,
        });
        // options.mobilePhone = mobilePhone;
        // if (name == title) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '已有该发票抬头信息, 确认更新？',
        //     showCancel: true,
        //     success: (res) => {
        //       if(res.confirm) {
        //         this.setData({
        //           options,
        //         })
        //       }
        //     },
        //     fail: (res) => {},
        //     complete: (res) => {},
        //   })
        // } else {

        // }
      }
    })
  },
  setInvoiceData(data) {
    this.setData({
      detail: data,
    })
    // wx.showModal({
    //   title: '提示',
    //   content: `已同步微信发票抬头信息`,
    //   showCancel: false,
    //   confirmText: '知道了',
    //   success: (res) => {
    //     if (res.confirm) {
    //     }
    //   },
    // })
  },
  hideCover(res) {
    const {
      id
    } = res.target;
    if (id != "titleItem") {
      this.setData({
        titleItemCover: true,
      });
    }
  },
  companyName(e) {
    const {
      value
    } = e.detail;
    this.queryInvoiceTitleByName(value);
    this.setData({
      titleItemCover: false,
      bankName: '',
      taxNumber: '',
      bankAccount: '',
    });
  },

  queryInvoiceTitleByName(name) {
    wx.request({
      url: api.getInvoiceTitle(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        t: name,
        a: 0,
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {
        const {
          data: {
            module
          }
        } = res;
        this.setData({
          titleItem: module,
        })
      }
    })
    // wx.request({
    //   url: api.queryInvoiceTitleByName(),
    //   method: "POST",
    //   header: conf.getHeader(),
    //   data: {
    //     name,
    //     session: wx.getStorageSync('sessionCode'),
    //   },
    //   success: (res) => {
    //     const { data: { module } } = res;
    //     if (module && module.length > 0) {
    //       const list = module.filter((item) => {
    //         return item.type == 1;
    //       })
    //       this.setData({
    //         titleItem: list,
    //       })
    //     }
    //   }
    // })
  },
  selectIvoiceItem(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const selectData = this.data.titleItem[index];
    const {
      detail
    } = this.data;
    selectData.type = 1;
    const params = {
      telephone: selectData.fixedPhone,
      address: selectData.location,
      account: selectData.bankAccount,
      taxId: selectData.taxId,
      name: selectData.name,
      bank: selectData.bank,
    }
    this.setData({
      titleItemCover: true,
      detail: {
        // ...detail,
        ...params
      },
    });
  },

  selectEvent(e) {
    const {
      index
    } = e.detail;
    wx.setStorageSync('selectTypeIndex', index)
    this.setData({
      selectTypeIndex: index,
    })
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
        minipId: api.minipId,
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
          // this.decodePhoneNumber(this.params);
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

  getphonenumber(option) {
    const {
      encryptedData,
      iv
    } = option.detail;
    const params = {
      encryptedData,
      iv,
      // session: wx.getStorageSync('sessionCode'),
    };
    this.params = params;
    this.decodePhoneNumber(params)
    // wx.checkSession({
    //   success: () => {
    //     console.log('未过期');
    //     // this.decodePhoneNumber(params)
    //     this.login()
    //   },
    //   fail: () => {
    //     console.log('已过期');
    //     this.login()
    //   }
    // })

  },
  decodePhoneNumber(option) {
    wx.request({
      url: api.getUserPhoneNumber(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        ...option,
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {

        const {
          success
        } = res.data;
        if (success) {
          const {
            module: {
              phoneNumber
            }
          } = res.data;
          this.setData({
            mobilePhone: phoneNumber,
          })
        }
      }
    })
  },
  uploadBizlicense() {
    this.hide_mm_bg();
    wx.chooseImage({
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中...',
          mask: true,
        })
        wx.uploadFile({
          url: api.uploadGeneral(),
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            session: wx.getStorageSync('sessionCode'),
          },
          success: (res) => {
            console.log('----------------', res)
            const {
              success,
              module
            } = JSON.parse(res.data);
            wx.hideLoading();
            if (success) {
              wx.showLoading({
                title: '识别中...',
                mask: true,
              })
              this.getBizlicenseByUpload(module.taskId);
              this.count = 1;
            }
          }
        })
      }
    })
  },
  getBizlicenseByUpload(taskId) {
    wx.request({
      url: api.getBizlicenseByUpload(),
      method: "POST",
      header: conf.getHeader(),
      data: {
        mid: taskId,
        session: wx.getStorageSync('sessionCode'),
      },
      success: (res) => {
        const {
          success,
          errorCode,
          module
        } = res.data;
        console.log(res.data);
        if (success) {
          wx.hideLoading();
          wx.showToast({
            title: module.toastMessage || '识别成功',
            icon: 'none',
            duration: module.toastMessage ? 3200 : 1500
          })
          console.log(module);
          const detail = {
            taxId: module.taxId,
            name: module.name,
            address: module.location,
            telephone: module.fixedPhone || '',
            bank: module.bank || '',
            account: module.bankAccount || '',
          }
          this.setData({
            detail,
            mm_bg: false
          })
          clearTimeout(this.timer)
          return;
        }
        if (!success && errorCode == 30011) {
          wx.hideLoading();
          wx.showToast({
            title: '识别失败',
            icon: 'none',
          })
          clearTimeout(this.timer)
          return;
        }
        if (this.count >= 39) {
          wx.hideLoading();
          wx.showToast({
            title: '识别失败',
            icon: 'none',
          })
          clearTimeout(this.timer)
          return;
        }

        if (!success) {
          this.count++;
          this.timer = setTimeout(() => {
            this.getBizlicenseByUpload(taskId);
          }, 500)
        }
      }
    })
  },
  onHide: function() {
    clearTimeout(this.timer)
  },
  onUnload: function() {
    clearTimeout(this.timer)
  }
})