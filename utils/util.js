const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//修改优惠券显示格式及条件
export function formatCouponsCard(option) {
  option.forEach(res => {
    res.vailyTime = res.vailyTime.split("至")[0] + " 至 " + res.vailyTime.split("至")[1]
    if (res.type !== "DONATE") {
      res.value = res.value.substr(0, res.value.length - 1)
    }
  })
  return option
}

export function formatCouponsCardDesc(option) {
  option.vailyTime = option.vailyTime.split("至")[0] + " 至 " + option.vailyTime.split("至")[1]
  if (option.cardType !== "DONATE") {
    option.cardValue = option.cardValue.substr(0, option.cardValue.length - 1)
  }
  option.description = JSON.parse(option.description)
  return option
}
export function formatCouponsCardAduit(option) {
  if (option.length < 1) {
    wx.showToast({
      title: '没有要审核的优惠券',
      duration: 2000,
      icon: 'none'
    });
  }
  option.forEach(res => {
    res.vailyTime = res.vailyTime.split("至")[0] + " 至 " + res.vailyTime.split("至")[1]
    if (res.cardType !== "DONATE") {
      res.cardValue = res.cardValue.substr(0, res.cardValue.length - 1)
    }
  })
  return option
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 网络请求
const request = function (url, method, data, msg, succ, fail, com) {
  // 小程序顶部显示Loading
  // wx.showNavigationBarLoading();
  if (msg != "") {
    wx.showLoading({
      title: msg
    })
  }
  wx.request({
    url: url,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: method,
    success: res => {
      console.log(url + ' 提交的data:', data);
      if (succ) succ(res);
    },
    fail: err => {
      wx.showToast({
        title: '网络错误，请稍后再试···',
        icon: 'none'
      })
      if (fail) fail(err);
    },
    complete: com => {
      // wx.hideNavigationBarLoading();
      if (msg != "") {
        wx.hideLoading();
      }
      console.log(url + ' 返回的data:', com.data);
    }
  })
}
export function getUrlParams(option) {
  const str = decodeURIComponent(option);
  const newStrArr = str.split('&');
  const obj = {};
  newStrArr.forEach((item) => {
    const itemArr = item.split('=');
    obj[itemArr[0]] = itemArr[1]
  })
  return obj;
}

module.exports = {
  request: request,
  formatTime: formatTime, formatCouponsCardAduit, formatCouponsCard, formatCouponsCardDesc,
  getUrlParams,
}
