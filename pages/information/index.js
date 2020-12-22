// pages/information/index.js
const api = require('../../utils/api.js');
const conf = require('../../utils/conf.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    appId: '',
    shopName: '',
    show: false,
    selectTypeIndex: 3,
    canOpenType:'',
    logUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { detail, appId } = options;
    this.detail = detail;
    this.appId = appId;
    if (detail) {
      const data = JSON.parse(decodeURIComponent(detail))
      this.invoiceInfo = data;
      this.setData({
        detail: data,
      })
    }
    if (appId) {
      this.getInvoiceShopInfo(appId)
      this.setData({
        appId: appId,
      })
    }
  },
  showInfo() {
    this.setData({
      show: !this.data.show,
    });
  },
  deleteEvent() {
    const { detail: { id } } = this.data;
    wx.showModal({
      title: '提示',
      content: '确定删除当前发票信息？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          this.deleteInvoiceTitle(id);
          wx.showLoading({
            title: '加载中...',
          })
        }
      },
    })
    
  },
  deleteInvoiceTitle(id) {
    wx.request({
      url: api.deleteInvoiceTitle(),
      data: {
        session: wx.getStorageSync('sessionCode'),
        titleId: id,
      },
      header: conf.getHeader(),
      method: 'POST',
      success: (res) => {
        wx.showToast({
          title: '删除成功',
        })
        
        wx.navigateBack({
          delta: 1
        })
        
      },
      complete: (res) => {
        setTimeout(() => {
          wx.hideLoading();
          this.addRequestFlag = false;
        }, 1000)
      },
    })
  },
  toOpenInvoiceDetail() {
    wx.navigateTo({
      url: `/pages/detail/index?detail=${this.detail}&appId=${this.appId}`,
    })
  },
  toDetail() {
    wx.navigateTo({
      url: `/pages/detail/index?detail=${this.detail}`,
    })
  },
  addInvoice(e) {
    this.postOpenInvoiceTitle();
  },
  postOpenInvoiceTitle() {
    if (this.addRequestFlag) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.openRequestFlag = true;
    const item = this.invoiceInfo;
    let params = {};
    if (this.data.selectTypeIndex == 3) {
      wx.showToast({
        title: '请选择发票据类型',
        icon: 'none',
      })
      return;
    }
    if (item.name == '') {
      wx.showToast({
        title: '请填写单位名称',
        icon: 'none',
      })
      return;
    }
    if (item.taxId == '') {
      wx.showToast({
        title: '请填写税号',
        icon: 'none',
      })
      return;
    }
    if (item.address == '') {
      wx.showToast({
        title: '请填写单位地址',
        icon: 'none',
      })
      return;
    }
    if (item.telephone == '') {
      wx.showToast({
        title: '请填写电话号码',
        icon: 'none',
      })
      return;
    }
    if (item.bank == '') {
      wx.showToast({
        title: '请填写开户银行',
        icon: 'none',
      })
      return;
    }
    if (item.account == '') {
      wx.showToast({
        title: '请填写银行账户',
        icon: 'none',
      })
      return;
    }
    // if (mobilePhone == '') {
    //   wx.showToast({
    //     title: '请填手机号码',
    //     icon: 'none',
    //   })
    //   return;
    // }
    const reg = /^1(3|4|5|7|8|8|9)\d{9}$/;
    if (item.mobilePhone != '' && !reg.test(item.mobilePhone)) {
      wx.showToast({
        title: '您填写的号码有误',
        icon: 'none',
      })
      return false;
    }
    if (item.email != '') {
      const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!pattern.test(item.email)) {
        wx.showToast({
          title: '你输入的邮箱有误！',
          icon: 'none',
        });
        return;
      }
    }
    if (item.type == 0) {
      params.session = wx.getStorageSync('sessionCode');
      params.mobilePhone = item.mobilePhone;
      params.email = item.email;
      params.name = item.name;
      params.type = item.type;
      params.appId = this.appId;
      params.fastType = this.data.selectTypeIndex;
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
      params.appId = this.appId;
      params.fastType = this.data.selectTypeIndex;
    }
    wx.request({
      url: api.postOpenTicket(),
      data: params,
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { module, success } = res.data;
        if (success) {
          wx.navigateBack({
            delta: 1
          })

          // wx.navigateTo({
          //   url: `/pages/openning/index?params=${encodeURIComponent(JSON.stringify(params))}&id=${module.uuid}`,
          // })
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
        const { success, module } = res.data;
        if (success) {
          this.setData({
            shopName: module.shopName,
            logUrl: module.logUrl,
            canOpenType: module.fastType,
            selectTypeIndex: module.fastType === 0 || module.fastType === 2 ? 0 : 1,
          })
        }
      },
    })
  },
  selectEvent(e) {
    const { index } = e.detail;
    this.setData({
      selectTypeIndex: index,
    })
  },
})