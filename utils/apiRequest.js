const {
  request
} = require("../utils/http.js")
// 新添加

const header = {
  "Content-Type": "application/x-www-form-urlencoded",
}

const jsonHeader = {
  "Content-Type": "application/json",
}
const scanGodown = (data, loading = false) => {
  return request('/v1/card/scanGodown.do', data, "POST", header, loading)
}
const getCardList = (data, loading = false,mock=false) => {
  return request('/v1/card/getCardList.do', data, "GET", jsonHeader, loading,mock)
}
const getCardDetail=(data,loading=false)=>{
  return request('/v1/card/getCardDetail.do',data,"GET",jsonHeader,loading)
}
const decrypt = (data, loading = false) => {
  return request('/v1/card/decrypt.do', data, "POST", header, loading)
}
const isBind = (data, loading = false) => {
  return request('/v1/card/isBind.do', data, "POST", header, loading)
}
const isAudit = (data, loading = false) => {
  return request('/v1/card/isAudit.do', data, "POST", header, loading)
}
const bind = (data, loading = false) => {
  return request('/v1/card/bind.do', data, "POST", header, loading)
}
const removeBind = (data, loading = false) => {
  return request('/v1/card/removeBind.do', data, "POST", header, loading)
}
const auditList = (data, loading = true) => {
  return request('/v1/card/auditList.do', data, "POST", header, loading)
}
const auditCardDetail = (data, loading = false) => {
  return request('/v1/card/auditCardDetail.do', data, "GET", jsonHeader, loading)
}
const releaseCard = (data, loading = false) => {
  return request('/v1/card/releaseCard.do', data, "POST", header, loading)
}
const companyWifiList = (data, loading = false) => {
  return request('/v1/wifi/companyWifiList.do', data, "GET", jsonHeader, loading)
}
module.exports = {
  scanGodown,
  getCardList,
  getCardDetail,
  decrypt,
  isBind,
  isAudit,
  bind,
  removeBind,
  auditList,
  auditCardDetail,
  releaseCard,
  companyWifiList
}
