// pages/mine/bindAlipay/aiPay.js
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    plain: false,
    disabled: false,
    code: "",
    code_btn: "获取验证码",
    code_disabled: false,
    code_plain: true,
    num: 60,
    name:"",
    account:"",
    tel:""
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
    var num = getApp().globalData.user.phone;
    var num3 = num.substr(0,3);
    var num4 = num.substr(7,4);
    this.setData( {
      tel: num
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
  
  // },
  // 获取真实姓名
  getInputName(e){
    this.setData( {
      name: e.detail.value
    } )
  },
  //获取账号
  getInputAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },
  // 获取用户输入的验证码
  getInputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  getAjaxCode: function () {
    netWork.post("UserInfo/sendCode", { phone:this.data.tel},(res)=>{
      if(res.code==="000"){
        var timer = setInterval(() => {
          this.data.num--
          if (this.data.num == 0 || this.data.isShowNew) {
            clearInterval(timer);
            this.setData({
              code_btn: `获取验证码`,
              code_disabled: false,
              num: 60,
              code_plain: true,
            })
          } else {
            this.setData({
              code_btn: `${this.data.num}s重新发送`,
              code_disabled: true,
              code_plain: true
            })
          }
        }, 1000)
      }else{
        wx.showToast({
          title: '发送验证码失败,请稍后重试',
          icon:'none'
        })
      }
    })
  },
  // 验证绑定支付宝
  checkPhone(){
    if (!this.data.name) {
      wx.showToast({
        title: '请填写用户名',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.account) {
      wx.showToast({
        title: '请填写支付宝账号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!this.data.code) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      loading: true,
      disabled: true,
    })
    netWork.post("userInfo/bindAlipay", { 
      phone: this.data.tel, 
      valid_code: this.data.code, 
      alipay: this.data.account, 
      real_name:this.data.name
      },(res)=>{
        if(res.code==="000"){
          wx.showToast({
            title: '支付宝绑定成功',
            success:()=>{
              getApp().globalData.user.alipay = this.data.account;
              wx.navigateBack();
            }
          })
        }else{
          wx.showToast({
            title: '支付宝绑定失败,请稍后再试',
          })
          this.setData({
            loading: false,
            disabled: false,
          })
        }
      })
  }
})