// pages/relation_from/relation_from.js
var that; 
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
var getBizlicenseByUpload_setTimeout, getBizlicenseByUpload_setTimeout_time;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'https://aikaoya.cloudlinks.com.cn/wq.jpg',
    show_web: false,
  },
  previewImage: function (e) {
    wx.previewImage({
      urls: this.data.scene.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },
  onLoad(option){
    console.log('option',  option.id.length)
  },
  click2(){
    this.setData({
      show_web:true
    })
  },
  click(){
    var a = '';
    var b= '';
    for(let i=0;i<1000000;i++){
      a = a+ '' +i
    }
    wx.navigateTo({
      url: 'test?id=' + a,
    })
  }
})