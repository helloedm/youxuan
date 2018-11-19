// pages/order/order.js
const netWork=require("../../utils/network.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529647402466&di=d754a753ddb58eef176539afe2853947&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201501%2F14%2F20150114145326_sQPjW.jpeg',
    open:false,
    couponArr:null,
    address: null,
    items: null,
    total_goods_money: null,
    platform_coupon: null,
    total_pay_money: null,
    platform_discount_money: null,
    remark:"",
    orderType:'1',
    total_quantity:0,
    isiphoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderType = this.data.orderType;
    if (options.type){
      orderType = options.type;
    }
    this.setData({
      orderType: orderType
    })
    let isiphoneX = app.globalData.iphoneX;
    this.setData({
      isiphoneX:isiphoneX,
    })
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
    this.getpreOrder();
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
  onShareAppMessage: function () {
  
  },
  // 去支付
  payment(){
    if (!getApp().globalData.user.phone) {
      wx.showModal({
        title: '提示',
        content: '您还没有绑定手机号',
        confirmText: '去绑定',
        success: () => {
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
    if(!this.data.address){
      wx.showToast({
        title: '请选择地址',
        icon:'none'
      })
      return
    }
    let otherUid = wx.getStorageSync('otherUid');
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    let items = wx.getStorageSync("orders") || [];
    wx.showLoading({
      title: '正在下单中',
      mask:true
    })
    netWork.post('order/create',{
      type:this.data.orderType,
      rec_addr_id:this.data.address.id,
      platform_coupon_id: this.data.platform_coupon ? this.data.platform_coupon.user_coupon.id:'',
      remark: this.data.remark,
      store_uid: otherUid,
      items: JSON.stringify(items)
    },(res)=>{
      wx.hideLoading();
      if(res.code==="000"){
        /**
         * 删除已经下单的商品
         * 保存订单号, 倒计时, 支付金额
         */
        // let newCart=[];
        items.forEach((item2)=>{
          cart.forEach((item,i)=>{
            if(item.sku_id==item2.sku_id){
              cart.splice(i,1);
            }
          })
        })
        wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
        wx.redirectTo({
          url: '/pages/order/payment/payment?tradeno=' + res.data.tradeno + 
                '&pay_money=' + res.data.pay_money + 
                '&pay_expire=' + res.data.pay_expire
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  /**
   * 订单预提交
   */
  getpreOrder(){
    let orders = wx.getStorageSync("orders") || [];
    wx.showLoading({
      title: '正在拉取订单详情',
      mask:true
    })
    let storeid = wx.getStorageSync("otherUid");
    netWork.post('order/preOrder', { items: JSON.stringify(orders), type: this.data.orderType, store_uid: storeid},(res)=>{
      wx.hideLoading();
      if(res.code==="000"){
        let address = wx.getStorageSync("address") ? wx.getStorageSync("address") : res.data.address;
        wx.removeStorageSync("address");
        this.setData({
          address: address,
          items: res.data.items,
          total_goods_money: res.data.total_goods_money,
          platform_coupon: res.data.platform_coupon,
          total_pay_money: res.data.total_pay_money,
          platform_discount_money: res.data.platform_discount_money,
          total_quantity: res.data.total_quantity
        })
      }else{
        wx.showModal({
          title: '提示',
          content:res.msg,
          showCancel:false
        })
      }
    })
  },
  /**
   * 选择优惠券
   */
  onMyEvent(e){
    console.log(e);
  },
  /**
   * 开启选择优惠券
   */
  chooseCoupon(){
    this.setData({
      open:true
    })
  },
  /**
   * 买家留言
   */
  bindRemark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  /**
   * 去选择地址
   */
  goAddress(){
    wx.navigateTo({
      url: '/pages/mine/address/address?from=order'
    })
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      app.saveFormId(formId, 1);
    }
  }
})