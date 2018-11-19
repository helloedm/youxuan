// pages/mine/phone/phone.js
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
    code_btn:"获取验证码",
    code_disabled: false,
    code_plain: true,
    num: 60,
    isShowNew:false,
    newTel:"",
    phone:""
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
      phone: getApp().globalData.user.phone
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
  // 获取验证码
  getAjaxCode:function(){
    netWork.post('UserInfo/sendCode', { phone:this.data.phone},(re)=>{
      this.setData({
        code_btn: `${this.data.num}s重新发送`,
        code_disabled: true,
        code_plain: true
      })
      var timer = setInterval( ()=>{
        this.data.num--
        if (this.data.num == 0 || this.data.isShowNew){
          clearInterval(timer);
          this.setData({
            code_btn: `获取验证码`,
            code_disabled: false,
            num:60,
            code_plain: true,
          })
        }else{
          this.setData({
            code_btn: `${this.data.num}s重新发送`,
            code_disabled: true,
            code_plain:true
          })
        }
      

      },1000 )
    })
  },
  // 获取新手机验证码
  getNewAjaxCode(){
    if (!this.data.newTel ) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    netWork.post('UserInfo/sendCode', { phone: this.data.newTel }, (re) => {
      this.setData({
        code_btn: `${this.data.num}s重新发送`,
        code_disabled: true,
        code_plain: true
      })
      var timer = setInterval(() => {
        this.data.num--
        if (this.data.num == 0 ) {
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
    });
  },
  // 获取用户输入的验证码
  getInputCode:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  //获取用户输入的手机
  getInputNewTel(e){
    this.setData({
      newTel: e.detail.value
    })
  },
  // 检测绑定的手机
  checkPhone:function(){
    
    if (!this.data.newTel&&this.data.isShowNew) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    
    if (!(/^1[34578]\d{9}$/.test(this.data.newTel)) && this.data.isShowNew){
      wx.showToast({
        title: '手机号输入有误',
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
    if(this.data.isShowNew){
     
      console.log(this.data.code)
    }else{
      this.setData({
        loading: true,
        disabled: true,
      })
      netWork.post('UserInfo/checkPhoneCode', { valid_code: this.data.code, phone: this.data.phone}, (res) => {
        if(res.code=="000"){
          this.setData({
            isShowNew: true,
            loading: false,
            disabled: false,
            code_btn: `获取验证码`,
            code_disabled: false,
            num: 60,
            code_plain: true,
            code: ""
          })
        }
        this.setData({
          loading: false,
          disabled: false,
        })
      })
    } 
  },
  updatePhone(){
    if (!this.data.newTel && this.data.isShowNew) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.newTel)) && this.data.isShowNew) {
      wx.showToast({
        title: '手机号输入有误',
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
    netWork.post('UserInfo/updatePhone', { valid_code: this.data.code, phone: this.data.newTel}, (res) => {
      if (res.code == "000") {
        getApp().globalData.user.phone = this.data.newTel;
        wx.showToast({
          title: '修改成功',
          success:(res)=>{
            wx.navigateBack();
          }
        })
      }
      this.setData({
        loading: false,
        disabled: false,
      })
    })
  }
})