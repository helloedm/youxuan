// pages/index/visitor/visitor.js
var netWork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitordata: [],
    visitornum:0,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.storerecord();
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
  /**访问店铺记录 */
  storerecord(){
    let otherUid = wx.getStorageSync("otherUid");
    let params = {
      uid: otherUid,
      limit: 100,
      page: this.data.page,
    }
    netWork.post('/userStore/visitStoreList', params, res => {
      if(res.code==="000"){
        this.setData({
          visitordata: res.data.data,
          visitornum: res.data.total
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})