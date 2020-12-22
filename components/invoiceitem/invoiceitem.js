// components/invoiceitem/invoiceitem.js
Component({
  /**
   * 组件的属性列表
   * 
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    invoiceItem: {
      type: Object,
      value: {},
    },
    select: {
      type:Boolean,
      value:false,
    },
    index: {
      type: Number,
      value: 0,
    },
    selectStatus: {
      type: Boolean,
      value: false,
    },
    appId: {
      type: String,
      value: '',
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    // selected: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectEvent() {
      let { selectStatus } = this.data;
      if(selectStatus) {
        selectStatus = false;
      } else {
        selectStatus = true;
      }
      this.setData({
        selectStatus,
      });
      this.triggerEvent('selectEvent', { index: this.data.index, selectStatus});
    },
    toDetail() {
      const { invoiceItem } = this.data;
      const detail = encodeURIComponent(JSON.stringify(invoiceItem));
      if (this.data.appId) {
        wx.navigateTo({
          url: `/pages/information/index?detail=${detail}&appId=${this.data.appId}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/information/index?detail=${detail}`,
        })
      }
    }
  }
})
