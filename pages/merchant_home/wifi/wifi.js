
const {
  companyWifiList
} = require("../../../utils/apiRequest.js")
const app = getApp()
const api = require('../../../utils/api.js');
const conf = require('../../../utils/conf.js');
const { getUrlParams } = require('../../../utils/util.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link_wifi:false,//是否链接WIFI
    WiFi_account:'',
    WiFi_pass:'',
    shopName:'',
    wifi_lisk_fw:false
  },
  link() {
    console.log('000000000')
    let WiFi_account = this.data.WiFi_account;
    let WiFi_pass = this.data.WiFi_pass;
    wx.startWifi({
      success(res) {
        wx.connectWifi({
          SSID: WiFi_account,
          password: WiFi_pass,
          success(res) {
            console.log('链接成功', res.errMsg)
            wx.showToast({
              title: '链接成功',
              icon: 'none'
            })
            that.setData({
              link_wifi:true
            })
          }, fail(err) {
            console.log('链接失败',err)
            if(err.errCode==12005){
              wx.showToast({
                title: '链接失败，请打开WiFI开关',
                icon:'none'
              })
            } else if (err.errCode == 12003) {
              wx.showToast({
                title: '连接超时',
                icon: 'none'
              })
            } else if (err.errCode == 12002) {
              wx.showToast({
                title: '密码错误,请与商家确认密码',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  onLoad(options){
    that=this;
    let data ={
      tableCard: options.m_appId
    }
    companyWifiList(data).then(res => {
      console.log(res)
      let wifi_list = res.module;
      this.setData({
        wifi_list,
        WiFi_account: wifi_list[0].wifiName,
        WiFi_pass: wifi_list[0].wifiPwd,
        shopName: wifi_list[0].shopName,
      })
    })
  },
  // 返回
  return_btn(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 复制
  copy(){
    wx.setClipboardData({
      data: this.data.WiFi_pass,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})