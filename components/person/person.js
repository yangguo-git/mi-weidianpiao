// components/person/person.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    detail:{
      type: Object,
      value: null,
    },
    appId: {
      type: String,
      value: '',
    },
    mobilePhone: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getphonenumber(e) {
      const { detail } = e;
      console.log(detail);
      this.triggerEvent('getphonenumber', detail);
    },
    showInfo() {
      this.setData({
        show: true,
      });
    },
    hideInfo() {
      this.setData({
        show: false,
      });
    },
    handUp(e) {
      console.log(e);
      const {
        email,
        name,
        mobilePhone,
      } = e.detail.value;
      const eventType = e.detail.target.dataset.type;
      const { formId } = e.detail;
      if (name == '') {
        wx.showToast({
          title: '请填写姓名',
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
      if (mobilePhone !='' && !reg.test(mobilePhone)) {
        wx.showToast({
          title: '您填写的号码有误',
          icon: 'none',
        })
        return false;
      }
      if (email != '') {
        const pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!pattern.test(email)) {
          wx.showToast({
            title: '你输入的邮箱有误！',
            icon: 'none',
          });
          return;
        }
      }
      console.log(123);
      if (eventType == 'save') {
        this.triggerEvent('personSubmit', {
          type: 0,
          email,
          name,
          mobilePhone,
          formId,
        });
      }
      if (eventType == 'submit') {
        this.triggerEvent('personSubmit', {
          type: 0,
          email,
          name,
          mobilePhone,
          formId,
        });
      }
    }
  }
})
