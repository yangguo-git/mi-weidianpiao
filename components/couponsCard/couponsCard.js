// components/couponsCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '折扣券'
    },
    companyName:{
      type:String,
      value:'店名'
    },
    id: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: 'DISCOUNT'
    },
    vailyTime:{
      type:String,
      value:"2019-06-30至2019-07-30"
    },
    useTime:{
      type:String,
      useTime:"2019-07-24 16:40:29"
    },
    value: {
      type: String,
      value: '9.5折'
    },
    status: {
      type: String,
      value: "1"
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
  }
})
