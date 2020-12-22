const cardList = {
  'module|10': [{
    'id|+1': 1,
    'name|1': [
      "海底捞火锅（西直门店）",
      "海底捞火锅（东直门店）",
      "海底捞火锅（北直门店）",
      "海底捞火锅（南直门店）"
    ],
    'type|1': [
      "DISCOUNT",
      "DONATE",
      "CASH"
    ],
    'value': function () {
      if (this.type === "DISCOUNT") {
        return "9.5折"
      } else if (this.type === "DONATE") {
        return "赠品"
      } else {
        return "5元"
      }
    },
    'status': 1,
    'vailyTime': "2017-07-02至2019-12-03"
  }]
}
module.exports={
  cardList
}