// pages/mine/coupon/coupon.js
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["未使用", "使用记录", "已过期"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    open:"-1",
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  /**
   * 切换tab
   */
  tabClick: function (e) {
    let _this = this;
    _this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      list:null
    });
    this.getList();
  },
  openCoupon(e){
    let id = e.currentTarget.dataset.id != this.data.open ? e.currentTarget.dataset.id : '-1';
    this.setData({
      open:id
    })
  },
  /**
   * 获取优惠券列表
   */
  getList(){
    netWork.post('userCoupon/myCoupon',{
      page:1,
      limit:100,
      status: this.data.activeIndex - 0 + 1
    },(res)=>{
      if(res.code==="000"){
        this.setData({
          list:res.data.data
        })
      }
    })
  },
  /**
   * 去首页
   * 
   */
  goindex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})