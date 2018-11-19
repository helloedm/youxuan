// pages/vip/month/month.js
const netWork = require('../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:[],
    index:1,
    active:'-1',
    user:null
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
    this.getList();
    let user = getApp().globalData.user;
    console.log(user);
    this.setData({
      user:user
    })
    this.getUserCenterInfo();
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
  /**
   * 获取年超级会员礼包
   */
  getList(){
    netWork.get("UserFans/goodsList",{},(res)=>{
      this.setData({
        rows:res.data.rows
      })
    })
  },
  activeGoods(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      active: index
    })
  },
  active(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
  },
  copyInvite(){
    wx.setClipboardData({
      data: this.data.user.invite_code,
    })
  },
  // 成为超级会员
  becomeVip() {
    
    if (this.data.active == -1) {
      wx.showToast({
        title: '请先选择开通超级会员礼包',
        icon: "none"
      })
      return
    }
    let orders = [];
    let order = {};
    order.sku_id = this.data.rows[this.data.active].id;
    order.goods_id = this.data.rows[this.data.active].goods_id;
    order.quantity = 1;
    orders.push(order);
    wx.setStorageSync("orders", orders);
    wx.navigateTo({
      url: '/pages/order/order?type=2',
    })
  },
  //体验会员
  becomeVip2(){
    if (!getApp().globalData.user.phone){
      wx.showModal({
        title: '提示',
        content: '您还没有绑定手机号',
        confirmText:'去绑定',
        success:()=>{
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }
      })
      return
    }
    /**
    * 判断是否绑定邀请码
    */
    if (getApp().globalData.user && getApp().globalData.user.is_code == "0") {
      wx.navigateTo({
        url: '/pages/login/invitation/invitation',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    netWork.post("SuperFans/buyOne", { type: 'buyone', source:"xcx"},(res)=>{
      wx.hideLoading()
      if (res.code === "000") {
        let param = JSON.parse(res.data.param);
        wx.requestPayment({
          timeStamp: param.timeStamp,
          nonceStr: param.nonceStr,
          package: param.package,
          signType: param.signType,
          paySign: param.paySign,
          success: (res) => {
            wx.showToast({
              title: '支付成功',
            })
            wx.hideLoading();
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        })
      }else{
        wx.showToast({
          title: "您已经是超级会员",
          icon:"none",
          duration:5000
        })
      }
    })
  },
  /**
   * 获取个人中心信息
   */
  getUserCenterInfo() {
    netWork.get('UserInfo/getUserInfo', {}, (res) => {
      let user = res.data;
      this.setData({
        user: user
      })
    })
  },
  getUserInfoBtn(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      getApp().globalData.userInfo = e.detail.userInfo;
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
})