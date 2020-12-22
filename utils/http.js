// const apiHost = "https://mem.maduoduo.com.cn"
const {baseUrl} =require('api')
const Mock=require('mock.js')
const {cardList}=require('mockData')
const request = function (api, data, method, header, loading = true,mock=false) {
  return new Promise((resolve, reject) => {
    if(mock){
      if (api.indexOf("getCardList.do")!==-1){
        var list=cardList
      }
      let res = {
        statusCode: 200,
        data: Mock.mock(list)
      }
      if (res && res.statusCode == 200 && res.data) {
        resolve(res.data);
      } else {
        reject(res);
      }
    }else{
      try {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
        }
        wx.request({
          url: baseUrl + api,
          data: {
            session: wx.getStorageSync('sessionCode'),
            ...data
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // session: wx.getStorageSync('sessionCode'),
            ...header
          },
          method: method || 'POST',
          success: (res) => {
            if (loading) {
              wx.hideLoading()
            }
            if (res.statusCode === 200 && res.data.code === 0) {
              resolve(res.data)
            } else if (res.statusCode === 200 && res.data.code !== 0) {
              resolve(res.data)
              // console.log(res.data);
              // wx.showModal({
              //   title: "提示",
              //   content: res.data.msg,
              //   showCancel: false
              // })
            } else {
              resolve(res.data)
            }
          },
          fail: (res) => {
            if (loading) {
              wx.hideLoading()
            }
            reject("网络繁忙，请稍后再试")
          }
        })
      } catch (e) {
        console.log(e)
        reject(e)
      }
    }
  });
}

module.exports = {
  request
}
