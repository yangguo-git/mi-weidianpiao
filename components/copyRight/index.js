// components/copyRight/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String
    },
    padding: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: '400-1800-956',
      })
    },
    completemessage(e) {
      console.log(e);
      const { errcode } = e.detail;
      if (errcode === 0) {
        wx.showToast({
          title: '请查看微信服务通知',
          icon: 'none',
        })
      } else if (errcode === -3006) {
        wx.showToast({
          title: '请到微信联系我',
          icon: 'none',
        })
      }
    }
  }
})
