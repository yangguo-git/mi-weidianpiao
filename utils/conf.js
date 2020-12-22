const api = require('../utils/api.js');
var conf = {
  //后台数据接口路径

  // dataUrl:"https://test.whosmate.com",
  // baseUrl: "https://minvoice.weein.cn", 
  baseUrl: api.baseUrl,
}
const getHeader = () => {
  return {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
  };
}
const formatPrice = (price, unit) => {
  const p = typeof price !== 'number' ? parseInt(price, 10) : price;
  return unit ? (p / 100).toFixed(2) : p.toFixed(2);
}

module.exports = {
  baseUrl: conf.baseUrl,
  getHeader: getHeader,
  formatPrice: formatPrice,
  //form表单事件
  formSubmit: function(options) {
    wx.request({
      url: conf.baseUrl + "/v1/invoice/saveFormid.do",
      method: 'POST',
      data: {
        ...options,
        session: wx.getStorageSync('sessionCode'),
      },
      header: getHeader(),
      success: function(res) {
        if (res.statusCode == 200) {

        }
      }
    })
  },

  saveJumpRecord: function(options) {
    wx.request({
      url: api.saveJumpRecord(),
      method: 'POST',
      data: {
        ...options,
        session: wx.getStorageSync('sessionCode'),
      },
      header: getHeader(),
      success: function(res) {
        if (res.statusCode == 200) {
          console.log(res)
        }
      }
    })
  },
};