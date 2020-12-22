// components/loginModal/loginModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAudit:{
      type:Boolean,
      value:false
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
    refuse: function (event) {
      console.log(event)
      this.triggerEvent("onRefuse")
    },
    getUserInfo:function(event){
      this.triggerEvent("onGetUserInfo",event.detail)
    }
  }
})
