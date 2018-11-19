// pages/login/login.js
const newWork = require('../../utils/network.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowNew:true,
    loading: false,
    plain: false,
    disabled: false,
    code: "",
    code_btn: "获取验证码",
    code_disabled: false,
    code_plain: true,
    num: 60,
    newTel: ""
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
  // 获取新手机验证码
  getNewAjaxCode() {
    if (!this.data.newTel) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.newTel))) {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    newWork.post('UserInfo/sendCode', { 'phone': this.data.newTel},(res)=>{
      if(res.code==="000"){
        wx.showToast({
          title: '发送验证码成功',
          icon: 'none',
          duration: 1000
        })
      }else{
        wx.showToast({
          title: '发送验证码失败,请重试',
          icon: 'none',
          duration: 1000
        })
        return
      }
      this.setData({
        code_btn: `${this.data.num}s重新发送`,
        code_disabled: true,
        code_plain: true
      })
      var timer = setInterval(() => {
        this.data.num--
        if (this.data.num == 0) {
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
    })

  },
  //获取用户输入的手机
  getInputNewTel(e) {
    this.setData({
      newTel: e.detail.value
    })
  },
  //获取用户输入的验证码
  getInputCode(e){
    this.setData({
      code:e.detail.value
    })
  },
  binding(){
    if (!this.data.newTel) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.newTel))) {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if(!this.data.code){
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    let invite_code = getApp().globalData.invite_code;
    newWork.post('UserInfo/bindPhone',{
      phone: this.data.newTel,
      valid_code:this.data.code,
      userInfo:JSON.stringify(app.globalData.userInfo),
      invite_code: invite_code
    },(res)=>{
      if(res.code==="000"){
        app.globalData.user=res.data;
        wx.showToast({
          title: '绑定成功',
          icon:'success'
        });
        if (invite_code){
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }else{
          wx.redirectTo({
            url: '/pages/login/invitation/invitation',
          })
        }
      }
    })
  },
  bindPhone(){
    // app.globalData.userInfo = e.detail.userInfo;
    this.binding();
  },
  /**
   * 获取微信手机号
   */
  getPhoneNumber: function (e) {
    let invite_code = getApp().globalData.invite_code;
    console.log(invite_code);
    if (e.detail.errMsg=="getPhoneNumber:ok"){
      newWork.post("UserInfo/onceBindPhone",{
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        userInfo: JSON.stringify(app.globalData.userInfo),
        invite_code: invite_code
      },(res)=>{
        if(res.code=="000"){
          console.log(res.data);
          app.globalData.user = res.data;
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          });
          if (invite_code) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/invitation/invitation',
            })
          }
        }
      })
    }
  } 
})