// pages/success/index.js
const conf = require('../../utils/conf.js');
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    multiArray: [['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']],
    showType: false,
    invoiceType: '全部发票',
    invoiceTypeNum: '',
    selectDate: '发票日期',
    selectDateNum: '',
    multiIndex: [0, 0],
    requestStatus: false,
    invoiceTypes: ['全部发票', '电子发票', '纸质发票'],
    selectInvoiceIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const year = (new Date()).getFullYear();
    const arr = ['不限时间', year, year - 1]
    const multiArray = this.data.multiArray;
    this.year = year;
    multiArray.unshift(arr);
    this.setData({
      multiArray,
    })
    this.getMyInvoices({
      type: '',
      qryTime: '',
    });
  },
  getMyInvoices(params) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: api.getMyInvoices(),
      data: {
        ...params,
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { success, module } = res.data;
        if (success && module.length > 0) {
          const dataList = module.map((item) => {
            item.time = item.time.replace(/-/g, '.');
            item.xmove = 0;
            return item;
          })
          this.setData({
            dataList,
          })
        }
        if (success && module.length == 0) {
          this.setData({
            dataList: [],
          })
        }
      },
      complete: () => {
        wx.hideLoading();
        this.setData({
          requestStatus: true,
        })
      }
    })
  },

  setXmove(activeIndex, xmove) {
    let list = this.data.dataList
    const dataList = list.map((item, index) => {
      if (activeIndex == index) {
        item.xmove = xmove;
      } else {
        item.xmove = 0;
      }
      return item;
    })
    this.setData({
      dataList,
    })
  },

  handleMovableChange(e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 显示删除按钮
   */
  showDeleteButton(e) {

    let index = e.currentTarget.dataset.index

    this.setXmove(index, -120)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton(e) {
    let index = e.currentTarget.dataset.index

    this.setXmove(index, 0)
  },

  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },

  /**
  * 处理touchend事件
  */
  handleTouchEnd(e) {
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -70) {
      this.showDeleteButton(e)
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      // this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },

  handleDeleteInvioce(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除此开票记录？',
      confirmColor: '#07af12',
      success: (res) => {
        if (res.confirm) {
          this.deleteInvioce(e);
        }
      }
    })
  },

  deleteInvioce(e) {
    const { id } = e.currentTarget.dataset;
    const { invoiceTypeNum, selectDateNum } = this.data;
    wx.showLoading({
      title: '删除中...',
      mask: true,
    })
    wx.request({
      url: api.postDeleteMyInvoice(),
      data: {
        uuid: id,
        session: wx.getStorageSync('sessionCode'),
      },
      header: conf.getHeader(),
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        const { success } = res.data;
        if (success) {
          this.getMyInvoices({
            type: invoiceTypeNum,
            qryTime: selectDateNum,
          });
        } else {

        }
      },
      complete: () => {
        wx.hideLoading();
        this.setData({
          requestStatus: true,
        })
      }
    })
  },

  showActionSheet() {
    const itemList = ['全部发票', '电子发票', '纸质发票'];
    wx.showActionSheet({
      itemList,
      success: (res) => {
        const { tapIndex } = res;
        const type = tapIndex == 0 ? '' : tapIndex;
        this.setData({
          invoiceType: itemList[tapIndex],
          invoiceTypeNum: tapIndex == 0 ? '' : tapIndex,
        })
        const { selectDateNum } = this.data;
        this.getMyInvoices({
          type,
          qryTime: selectDateNum,
        });
      },
      fail(res) {
        wx.hideToast();
      },
    })
  },

  showInvoiceType() {
    // this.setData({
    //   showType: true,
    // })
  },

  selectInvoiceEvent(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      selectInvoiceIndex: index,
    })
  },

  coverEvent() {
    this.setData({
      showType: false,
    })
  },

  clickTypeItem() {
    this.setData({
      showType: false,
    })
  },

  bindMultiPickerChange(res) {
    const { value } = res.detail;
    const { multiArray } = this.data;

    if (value[0] == 0) {
      this.setData({
        selectDate: '发票日期',
        selectDateNum: '',
      })
    }
    if (value[0] !== 0) {
      const dayMon = multiArray[0][value[0]] + '年' + multiArray[1][value[1]];
      const selectDateNum = (dayMon.replace(/年/g, '-')).replace(/月/g, '');
      this.setData({
        selectDate: dayMon,
        selectDateNum,
      })
    }
    const { invoiceTypeNum, selectDateNum } = this.data;
    this.getMyInvoices({
      type: invoiceTypeNum,
      qryTime: selectDateNum,
    });
  },
  bindMultiPickerColumnChange(res) {
  },

  toDetail(e) {
    const { type, index, paperstatus } = e.currentTarget.dataset;
    const detail = encodeURIComponent(JSON.stringify(this.data.dataList[index]))
    // if (type == 1 && paperstatus !== 0 && paperstatus != 1 || type == 1 && paperstatus === 1) {
    if (type == 1) {
      wx.navigateTo({
        url: `/pages/eInvoiceDetail/index?&detail=${detail}`,
      })
    }
    if (type == 2 && paperstatus === 1) {
      wx.navigateTo({
        // url: `/pages/paperInvoiceDetail/index?&detail=${detail}`,
        url: `/pages/processed/index?&detail=${detail}&invoiceList=true`,
      })
    }
    if (type == 2 && paperstatus === 0 || type == 1 && paperstatus === 0) {
      wx.navigateTo({
        // url: `/pages/openning/index?&detail=${detail}`,
        url: `/pages/processed/index?&detail=${detail}&invoiceList=true`,
      })
    }
    if (type == 2 && paperstatus === 3) {
      wx.navigateTo({
        url: `/pages/processed/index?&detail=${detail}&invoiceList=true`,
      })
    }
  },
  selectInvoiceEvent() {

  },
})