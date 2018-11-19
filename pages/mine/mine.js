// pages/mine/mine.js
let globalData=getApp().globalData;
const netWork=require("../../utils/network.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'5',
    img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529647402466&di=d754a753ddb58eef176539afe2853947&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201501%2F14%2F20150114145326_sQPjW.jpeg",
    num: globalData.num,
    user:null,
    tel:'0571-89935939',
    becomeVip:false,
    phone:null,
    tabswitch:1,
    ismypage:false,
    isgomystore: false,
    ismyinfo: false,
    storename:''
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
    this.setData({
      phone: globalData.user.phone
    })
    this.getNum();
    this.getUserCenterInfo();
    this.getUser();
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
    if(otherUid != uid){ 
      this.setData({
        ismypage: false,
        tabswitch: 2
      })
    }else{
      this.setData({
        ismypage: true,
      })
    }
    this.getMyselfShopInfo();
    // if (globalData.user && !globalData.user.phone) {
    //   wx.navigateTo({
    //     url: '/pages/login/login'
    //   })
    //   return
    // }
    // if (!globalData.user || globalData.user && globalData.user.is_code == "0"){
    //   wx.navigateTo({
    //     url: '/pages/login/invitation/invitation'
    //   })
    //   return
    // }
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

  // 跳转到收益页面
  toEarnings(){
    wx.navigateTo({
      url:'/pages/mine/earnings/earnings'
    })
  },
  toTixian(){
    wx.navigateTo({
      url: '/pages/mine/withdraw/withdraw?money=' + this.data.user.balance
    })
  },
  // 去往粉丝页面
  toFans(){
    wx.navigateTo({
      url: '/pages/mine/fans/fans'
    })
  },
  //销售管理与个人中心切换
  switchSalesAndPersonal(e){
    let id = e.currentTarget.id;
    this.setData({
      tabswitch: id
    })
  },
  //获取个人店信息
  getMyselfShopInfo(){
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
    let vip = app.globalData.user.rank;
    let param = {
      uid: otherUid
    }
    netWork.post('/userStore/storeInfo',param,res => {
      if(res.code === "000"){
        let myselfinfo = res.data.data;
        this.setData({
          storename:myselfinfo.name
        })
        if(otherUid != uid){ 
          this.setData({
            ismyinfo: true,
          })
          wx.setTabBarItem({
            index: 1,
            text: '全部商品',
            iconPath: '',
            selectedIconPath: ''
          })
        }else{
          this.setData({
            ismyinfo: false,
          })
          wx.setTabBarItem({
            index: 1,
            text: '选货中心',
            iconPath: '',
            selectedIconPath: ''
          })
        }
        if(vip == 2){ //是有自己的店铺可以返回
          if(!this.data.ismyinfo){
            this.setData({
              isgomystore: false,
            })
          }else{
            this.setData({
              isgomystore: true,
            })
          }
        }
      }
    })
  },
  //回到我的店铺
  goMystores(){
    let uid = app.globalData.user.id;
    wx.setStorageSync('gostore', uid);
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 获取个人中心信息
   */
  getUserCenterInfo(){
    netWork.get('UserInfo/getUserCenterInfo',{},(res)=>{
      let user = res.data;
      // user.rank=2;
      let becomeVip = this.data.becomeVip;
      let oldUser = wx.getStorageSync("user") || {};
      if (oldUser && oldUser.rank==1 && user.rank==2){
        becomeVip=true;
      }
      wx.setStorageSync("user", user);
      this.setData({
        user: user,
        becomeVip: becomeVip
      })
    })
  },
  /**
   * 复制邀请码
   */
  copyInvite(e){
    let invite = e.currentTarget.dataset.invite;
    wx.setClipboardData({ 
      data: invite,
      success:()=>{
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  /**
   * 前往订单列表
   */
  goOrderList(e){
    let orderType = e.currentTarget.dataset.ordertype;
    wx.navigateTo({
      url: '/pages/order/list/list?type=' + orderType
    })
  },
  /**
   * 拨打电话
   */
  callPhone(e){
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    })
  },
  //获取购物车数量
  getNum() {
    let otherUid = wx.getStorageSync('otherUid');
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    let num = 0;
    for (var i = 0; i < cart.length; i++) {
      num += cart[i].num;
    }
    if (num > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: num + ''
      })
    }else{
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
  },
  /**
   * 关闭成为超级会员弹框
   */
  close(){
    this.setData({
      becomeVip:false
    })
  },
  /**
   * 获取微信头像授权
   */
  getUserInfoBtn(e){
    if (e.detail.errMsg == "getUserInfo:ok"){
      getApp().globalData.userInfo = e.detail.userInfo;
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 获取formID
   */
  saveFormId(v){
      console.log(v);
    if (v.detail.formId != 'the formId is a mock one') {
      console.log(v.detail.formId);
      // this.data.formIdArray.push(v.detail.formId);
    }
  },
  /**
   * 监听下拉事件
   */
  onPullDownRefresh() {
    this.getNum();
    this.getUserCenterInfo();
    wx.stopPullDownRefresh();
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      app.saveFormId(formId, 1);
    }
    console.log(formId);
  },
  /**
 * 获取用户详情
 */
  getUser() {
    netWork.get("UserInfo/getUserInfo", {}, (res) => {
      if (res.code == "000") {
        getApp().globalData.user = res.data;
      }
    })
  }
})