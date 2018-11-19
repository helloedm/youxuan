// pages/order/orderDetail/orderDetail.js
const netWork = require('../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,//快递编号
    logisticsinfo:[],
    com:'',//快递方式
    num:''//快递编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      logistics_company: options.logistics_company
    })
    this.getlogisticsinfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getlogisticsinfo:function(){
    let params = {
      express_code: this.data.id,
    }
    netWork.post('/express/query', params, res => {
      switch (res.data.state) {
        case '0':
          res.data.logisticsinfo_status='在途'
          break;
        case '1':
          res.data.logisticsinfo_status = '揽件'
          break;
        case '2':
          res.data.logisticsinfo_status = '疑难'
          break;
        case '3':
          res.data.logisticsinfo_status = '签收'
          break;
        case '4':
          res.data.logisticsinfo_status = '退签'
          break;
        case '5':
          res.data.logisticsinfo_status = '派件'
          break;
        case '6':
          res.data.logisticsinfo_status = '退回'
          break;
      }
      this.setData({
        logisticsinfo: res.data
      })
    })
  },
  copy(){
    wx.setClipboardData({
      data: this.data.id,
    })
  }
})