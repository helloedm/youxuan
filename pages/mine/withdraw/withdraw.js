// pages/mine/withdraw/withdraw.js
var netWork =require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:"",
    balance:0,
    type:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData( {
      balance: options.money,
      type: options.type?options.type:""
    } )
    
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
  getMoney(e){
    this.setData( {
      money: e.detail.value
    } )
  },
  reflect(){
    if (!this.data.money){
      wx.showToast({
        title: "请填写提现金额",
        icon: 'none',
        duration: 2000
      })
      return
    };
    if (+this.data.money > 500 || +this.data.money < 5) {
      wx.showToast({
        title: "提现金额最低5元，单次提现金额最高500元",
        icon: 'none',
        duration: 2000
      })
      return
    };
    if (+this.data.money > +this.data.balance) {
      wx.showToast({
        title: "当前账户没有那么多余额",
        icon: 'none',
        duration: 2000
      })
      return
    };
    let url = this.data.type == 'reward' ? '/UserInviteReward/withdraw' : '/UserProfile/withdraw';

    netWork.get(url, {money:this.data.money},(res)=>{
      if(res.code=="000"){
        wx.showToast({
          title: "提现申请成功",
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack();
        },2000)
      } else if (res.code == 1001){
        wx.showModal({
          title:'提示',
          content:res.msg,
          confirmText:"去设置",
          success:(e)=>{
            if(e.confirm){
              wx.navigateTo({
                url: '/pages/mine/bindAlipay/aiPay'
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none"
        })
      }
    })
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      getApp().saveFormId(formId, 1);
    }
  },
  /**
   * 全部提现
   */
  allwarn(){
    this.setData({
      money: this.data.balance
    })
  }
})