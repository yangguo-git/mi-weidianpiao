
const conf = require('../../utils/conf.js');
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 轮播
    swiperCurrent: 0,
    imgUrls: [
      '/images/banner1.jpg',
      '/images/banner2.jpg',
      '/images/banner3.jpg',
      '/images/banner4.jpg'
    ],
  },
  methods: {
    // 这里是一个自定义方法
    click_swiper(e){
      console.log('e', e.currentTarget.id)
      let idx = e.currentTarget.id;
      if (idx==0){
        this.tencent()
      } else if (idx == 1) {
        this.unicom()
      } else if (idx == 2) {
        this.wxPay()
      } else if (idx == 3) {
        this.more()
      }
    },

    wxPay() {
      wx.navigateTo({
        url: '/pages/merchant_home/payPoint/payPoint',
      })
    },
    more() {
      wx.showToast({
        title: '敬请期待',
        icon: 'none'
      })
    },
    unicom() {
      wx.navigateToMiniProgram({
        appId: 'wx1129fc27588b7898',
        path: '/pages/index',
        extraData: {},
        envVersion: '',
        success: function (res) {
          conf.saveJumpRecord({
            appId: 'wx1129fc27588b7898',
            path: '/pages/index',
            pathDesc: '宽带服务首页',
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    tencent() {
      wx.navigateToMiniProgram({
        appId: 'wx1a74e3dfe30a3067',
        path: '/kingCard/pages/tencentCard/tencentCard',
        extraData: {},
        envVersion: '',
        success: function (res) {
          conf.saveJumpRecord({
            appId: 'wx1a74e3dfe30a3067',
            path: '/kingCard/pages/tencentCard/tencentCard',
            pathDesc: '心意有礼腾讯王卡页面',
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    // 轮播
    swiperChange: function (e) {
      // console.log('轮播.current', e.detail.current)
      this.setData({
        index: e.detail.current,
        swiperCurrent: e.detail.current
      })
    },
  }
})