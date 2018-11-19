// pages/vip/vip.js
const netWork=require('../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowIntro:false,//是否显示规则说明
    rank: 1,
    myCom: {
      "invite_num": 0,  //今日邀请人数
      "invite_amount": 0,  //今日预估金额
      "total_invite_num": 0, //累计邀请人数
      "total_invite_amount": 0 //累计预估金额
    },
    rows:[],
    active:-1,
    inviteFans:[],
    invite_code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rank: getApp().globalData.user.rank,
      invite_code:getApp().globalData.user.invite_code
    })
    if(this.data.rank=="2"){
      this.myCombatGains();
      this.inviteFansRank();
    }
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    this.getvipGoods();
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
    // this.getUser();
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
  onShareAppMessage: function (options) {
    if (options.from =="button"){

    }
    let otherUid = wx.getStorageSync("otherUid");
    return {
      title: '全民拉新 - 瓜分百万奖金',
      path: '/pages/index/index?invite_code=' + getApp().globalData.user.invite_code + "&userid=" + otherUid
    }
  },
  // 成为超级会员
  becomeVip(){
    wx.navigateTo({
      url: '/pages/vip/month/month',
    })
    // if(this.data.active==-1){
    //   wx.showToast({
    //     title: '请先选择开通超级会员礼包',
    //     icon:"none"
    //   })
    //   wx.pageScrollTo({
    //     scrollTop: 900,
    //   })
    //   return
    // }
    // let orders=[];
    // let order={};
    // console.log(this.data.rows[this.data.active]);
    // order.sku_id = this.data.rows[this.data.active].id;
    // order.goods_id = this.data.rows[this.data.active].goods_id;
    // order.quantity = 1;
    // orders.push(order);
    // wx.setStorageSync("orders", orders);
    // wx.navigateTo({
    //   url: '/pages/order/order?type=2',
    // })
    // netWork.post("payment/UnifiedOrder/wxpay", { type: 'buyvip', source:"xcx"},(res)=>{
    //   if (res.code === "000") {
    //     let param = JSON.parse(res.data.param);
    //     wx.requestPayment({
    //       timeStamp: param.timeStamp,
    //       nonceStr: param.nonceStr,
    //       package: param.package,
    //       signType: param.signType,
    //       paySign: param.paySign,
    //       success: (res) => {
    //         wx.showToast({
    //           title: '支付成功',
    //         })
    //       }
    //     })
    //   }
    // })
  },
  openIntro(){
    this.setData({
      isShowIntro: true
    })
  },
  closeIntro(){
    this.setData({
      isShowIntro:false
    })
  },
  /**
   * 我的战绩
   */
  myCombatGains(){
    netWork.get("UserInviteReward/myCombatGains",{},(res)=>{
      if(res.code==="000"){
        this.setData({
          myCom:res.data
        })
      }
    })
  },
  /**
   * 获取当前超级会员商品
   */
  getvipGoods(){
    netWork.get("UserFans/goodsList",{},(res)=>{
      if(res.code==="000"){
        this.setData({
          rows:res.data.rows
        })
      }
    })
  },
  activeGoods(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      active:index
    })
  },
  /**
   * 获取用户详情
   */
  getUser(){
    netWork.get("UserInfo/getUserInfo",{},(res)=>{
      if(res.code=="000"){
        getApp().globalData.user=res.data;
        this.setData({
          rank: res.data.rank
        })
        if (this.data.rank == "2") {
          this.myCombatGains();
        }
      }
    })
  },
  /**
   * 获取邀请排行榜接口
   */
  inviteFansRank(){
    netWork.get("UserInviteReward/inviteFansRank",{},(res)=>{
      if(res.code=="000"){
        this.setData({
          inviteFans:res.data.data
        })
      }
    })
  },
  copy(){
    wx.setClipboardData({
      data: this.data.invite_code,
    })
  }

})