// components/company/company.js
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
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数
        // 新版本基础库不推荐使用这个字段，而是使用 Component 构造器的 observer 字段代替（这样会有更强的功能和更好的性能）
      }
    },
    appId: {
      type: String,
      value: '',
    },
    mobilePhone: {
      type: String,
      value: '',
    },
    taxId: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    if_name:false,
    if_taxId: false,
    if_telephone: false,
    if_mobilePhone: false,
    if_email: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getphonenumber(e) {
      const { detail } = e;
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
    inputEvent(e) {
      const { value } = e.detail;
      this.triggerEvent('companyName', {value});
    },
    handUp(e) {
      const { 
        address, 
        account, 
        bank, 
        email, 
        name,
        taxId, 
        telephone, 
        mobilePhone
      } = e.detail.value;
      const { formId } = e.detail;
      const eventType = e.detail.target.dataset.type;
      if(name == '') {
        wx.showToast({
          title: '请填写单位名称',
          icon: 'none',
        })
        this.setData({
          if_name:true,
        })
        return;
      }
      if (taxId == '') {
        wx.showToast({
          title: '请填写税号',
          icon: 'none',
        })
        this.setData({
          if_taxId: true,
        })
        return;
      } 
      
     
      // if (address == '') {
      //   wx.showToast({
      //     title: '请填写单位地址',
      //     icon: 'none',
      //   })
      //   return;
      // }
      // if (telephone == '') {
      //   wx.showToast({
      //     title: '请填写电话号码',
      //     icon: 'none',
      //   })
      //   return;
      // }
      // if (bank == '') {
      //   wx.showToast({
      //     title: '请填写开户银行',
      //     icon: 'none',
      //   })
      //   return;
      // }
      // if (account == '') {
      //   wx.showToast({
      //     title: '请填写银行账户',
      //     icon: 'none',
      //   })
      //   return;
      // }
      // if (mobilePhone == '') {
      //   wx.showToast({
      //     title: '请填手机号码',
      //     icon: 'none',
      //   })
      //   return;
      // }
      const reg = /^1(3|4|5|7|8|8|9)\d{9}$/;
      if (mobilePhone != '' && !reg.test(mobilePhone)) {
        wx.showToast({
          title: '您填写的号码有误',
          icon: 'none',
        })
        this.setData({
          if_mobilePhone: true,
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
        this.setData({
          if_email: true,
        })
      }
      const params = {
        type: 1,
        address,
        account,
        bank,
        email,
        name,
        telephone,
        mobilePhone,
        taxId,
        formId,
      }

      if (telephone != '' && address != '' && bank != '' && account != '') {//都不为空

      } else if (telephone == '' && address == '' && bank == '' && account == '') {//都为空

      } else {//提示
        var that = this;
        wx.showModal({
          title: '温馨提示',
          content: '如果专票开具，地址、电话，开户银行和账号必填，是否继续',
          success(res) {
            if (res.confirm) {
              if (eventType == 'save') {
                that.triggerEvent('companySubmit', params);
              }
              if (eventType == 'submit') {
                that.triggerEvent('companySubmit', params);
              }
            } else if (res.cancel) {
              
            }
          }
        })
        return;
      }

      if (eventType == 'save') {
        this.triggerEvent('companySubmit', params);
      }
      if (eventType == 'submit') {
        this.triggerEvent('companySubmit', params);
      }
    },
    uploadBizlicense() {
      this.triggerEvent('uploadBizlicense');
    }
  }
})
