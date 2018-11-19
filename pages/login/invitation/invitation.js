// pages/login/invitation/invitation.js
const netWork=require('../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
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
  getInput(e){
    console.log(e);
    this.setData({
      value:e.detail.value
    })
  },
  bindInvitation(){
    if(!this.data.value){
      wx.showToast({
        title: '请输入邀请码',
        icon:"none"
      })
      return false;
    }
    netWork.post('UserCoupon/inviteCode', { invite_code:this.data.value},(res)=>{
      if(res.code==="000"){
        wx.showToast({
          title: "绑定成功!"
        })
        getApp().globalData.user.is_code="1";
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    })
  }
})