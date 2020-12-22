// components/couponsCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardCheck:{
      type:Boolean,
      value:false
    },
    title: {
      type: String,
      value: '海底捞火锅（西直门店）'
    },
    id: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: 'DISCOUNT'
    },
    vailyTime: {
      type: String,
      value: "2019-06-30至2019-07-30"
    },
    value: {
      type: String,
      value: '9.5折'
    },
    status: {
      type: String,
      value: "1"
    },
    addStock:{
      type:Number,
      value:500
    },
    receiveCount:{
      type:Number,
      value:0
    },
    reviewRecoedId:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    checkChange:function(event){
      var _this=this;
     _this.setData({
       cardCheck: !_this.properties.cardCheck
     })
      // console.log(_this.properties.cardCheck)
      this.triggerEvent("onCheckCard", _this.properties)
    }
  }
})
