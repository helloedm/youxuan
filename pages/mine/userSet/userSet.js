// pages/mine/userSet/userSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"/images/svip.png",
    name:"",
    tel:'',
    sex:'',
    birthday:'2018-12-12',
    alipay:'',
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
    let user = getApp().globalData.user;
    this.setData({
      img: user.avatar,
      name: user.nickname,
      tel: user.phone,
      sex: user.sex == "1" ? '男' : '女',
      birthday: user.birthday,
      alipay: user.alipay
    })
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
  
  // }
})