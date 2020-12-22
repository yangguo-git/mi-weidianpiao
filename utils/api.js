// const baseUrl="https://tminvoice.weein.cn";
const baseUrl = "https://minvoice.weein.cn";
// const baseUrl="https://wytminvoice.weein.cn";

const minipId = 'unicom'; //unicom  winvoice_minip

const LOGIN = '/v1/user/login.do';
const INVOICE_TITLE_LIST = '/v1/invoice/getMyInvoiceTitles.do';
const ADD_INVOICE_TITLE = '/v1/invoice/addInvoiceTitle.do';
const OPEN_TICKET = '/v1/invoice/fastApplyForInvoice.do';
const UPDATE_INVOICE_TITLE = '/v1/invoice/updateInvoiceTitle.do';
const DELETE_INVOICE_TITLE = '/v1/invoice/deleteInvoiceTitle.do';
const QUERY_INVOICE_TITLE_BY_NAME = '/v1/invoice/queryInvoiceTitleByName.do';
const SAVE_FORMID = '/v1/invoice/saveFormid.do';
const GET_INVOICE_SHOP_INFO = '/v1/invoice/getInvoiceShopInfo.do';
const GET_MY_INVOICE = '/v1/invoice/getMyInvoices.do';
const UPDATE_ADD_CARD_STATUS = '/v1/invoice/updateAddCardStatus.do';
const SEND_MY_INVOICE_TO_EMAIL = '/v1/invoice/sendMyInvoiceToEmail.do';
const TO_DECRYPTM_ERCHANT_DATA = '/v1/invoice/toDecryptMerchantData.do';
const GET_INVOICE_BY_ID = '/v1/invoice/getInvoiceById.do';

// const LOGIN = '/v1/user/login.do';
const SAVE_JUMP_RECORD = '/v1/invoice/saveJumpRecord.do';
const CODE_IMAGE = '/api/captcha-image.do';
const TRACK_ORDER = '/v1/order/select.do';
const OPEN_TICKET_AND_ENPOWER = '/v1/invoice/createAndInsertCard.do';
const INVOICE_TITLE = '/v1/invoice/getInvoiceTitle.do';
const OPEN_TICKET_AND_ENPOWER_NEW = '/v1/invoice/createAndInsertCardNew.do';
const GET_USER_PHONE_NUMBER = '/v1/invoice/getUserPhoneNumber.do';
const GET_TEST_ORDER_INFO = '/v1/invoice/getTestOrderInfo.do';
const GET_LAST_TITLE = '/v1/invoice/getLastTitle.do';
const UP_LOAD_BIZLICENSE = '/v1/invoice/uploadGeneral.do';
const GET_BIZLICENSE_BY_UPLOAD = '/v1/invoice/getOcrGeneralByUpload.do';

const UPLOAD_GENERAL = '/v1/invoice/uploadGeneral.do';
const GET_OCRFENERAL_BY_UPLOAD = '/v1/invoice/getOcrGeneralByUpload.do';
const GET_CONTACT_MESSAGE_TYPE = '/v1/invoice/getDiversionInfoByEnterType.do'
module.exports = {
  login() {
    return baseUrl + LOGIN;
  },
  uploadGeneral() {
    return baseUrl + UPLOAD_GENERAL;
  },
  getOcrGeneralByUpload() {
    return baseUrl + GET_OCRFENERAL_BY_UPLOAD;
  },
  getInvoiceTitleList() {
    return baseUrl + INVOICE_TITLE_LIST;
  },
  postAddInvoiceTitle() {
    return baseUrl + ADD_INVOICE_TITLE;
  },
  postOpenTicket() {
    return baseUrl + OPEN_TICKET;
  },
  updateInvoiceTitle() {
    return baseUrl + UPDATE_INVOICE_TITLE;
  },
  deleteInvoiceTitle() {
    return baseUrl + DELETE_INVOICE_TITLE;
  },
  queryInvoiceTitleByName() {
    return baseUrl + QUERY_INVOICE_TITLE_BY_NAME;
  },
  saveFormid() {
    return baseUrl + SAVE_FORMID;
  },
  getCodeImage() {
    return baseUrl + CODE_IMAGE;
  },
  trackOrder() {
    return baseUrl + TRACK_ORDER;
  },
  openTicketAndEnpower() {
    return baseUrl + OPEN_TICKET_AND_ENPOWER;
  },
  getInvoiceTitle() {
    return baseUrl + INVOICE_TITLE;
  },
  getInvoiceShopInfo() {
    return baseUrl + GET_INVOICE_SHOP_INFO;
  },
  getMyInvoices() {
    return baseUrl + GET_MY_INVOICE;
  },
  updateAddCardStatus() {
    return baseUrl + UPDATE_ADD_CARD_STATUS;
  },
  sendMyInvoiceToEmail() {
    return baseUrl + SEND_MY_INVOICE_TO_EMAIL;
  },
  toDecryptMerchantData() {
    return baseUrl + TO_DECRYPTM_ERCHANT_DATA;
  },
  getInvoiceById() {
    return baseUrl + GET_INVOICE_BY_ID;
  },
  createAndInsertCardNew() {
    return baseUrl + OPEN_TICKET_AND_ENPOWER_NEW;
  },
  getUserPhoneNumber() {
    return baseUrl + GET_USER_PHONE_NUMBER;
  },
  getTestOrderInfo() {
    return baseUrl + GET_TEST_ORDER_INFO;
  },
  getLastTitle() {
    return baseUrl + GET_LAST_TITLE;
  },
  uploadBizlicense() {
    return baseUrl + UP_LOAD_BIZLICENSE;
  },
  saveJumpRecord() {
    return baseUrl + SAVE_JUMP_RECORD;
  },
  getBizlicenseByUpload() {
    return baseUrl + GET_BIZLICENSE_BY_UPLOAD;
  },
  getContactMessageType() {
    return baseUrl + GET_CONTACT_MESSAGE_TYPE;
  },
  baseUrl, minipId
}