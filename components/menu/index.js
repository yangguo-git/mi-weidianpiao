// components/menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectTypeIndex: {
      type: Number,
      value: 3,
    },
    type: {
      type: Number,
      value: 3,
    }
  },
  options: {
    addGlobalClass: true,
  },
  ready() {
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
    select(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { index })
    }
  }
})
