// pages/mine/earnings/earnings.js
var netWork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commision_banlance: "", //账户余额
    commision_total: "",   //累计结算收益
    pre_month_income: "", //上月预估收入
    cur_month_income: "", //本月预估收入
    yesterday_income: "", //昨日预估收入
    today_income: "", //今日预估收入
    status: ''
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
    this.init();
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  // 立即提现
  toTixian() {
    wx.navigateTo({
      url: '/pages/mine/withdraw/withdraw?money=' + this.data.commision_banlance+'&type=reward'
    })
  },
  // 去往说明
  goIntro(){
    wx.navigateTo({
      url: '/pages/mine/reward/intro/intro'
    })
  },
  init() {
    netWork.get('UserInviteReward/myReward', {}, res => {
      if (res.code == '000') {
        this.setData({
          commision_banlance: res.data.commision_banlance, //账户余额
          commision_total: res.data.commision_total,   //累计结算收益
          pre_month_income: res.data.pre_month_income, //上月预估收入
          cur_month_income: res.data.cur_month_income, //本月预估收入
          yesterday_income: res.data.yesterday_income, //昨日预估收入
          today_income: res.data.today_income, //今日预估收入
          status: res.data.is_banlance
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }


    }, function (err) {
      console.log(err)
    })

  }
})