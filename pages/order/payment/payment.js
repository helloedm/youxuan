// pages/order/payment/payment.js
const netWork=require("../../../utils/network.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '微信支付', value: '0', checked: true }
      // { name: '余额支付', value: '1', checked: true }
    ],
    tradeno:'',
    pay_money:'',
    pay_expire:'',
    showTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timer=setInterval(()=>{
      let _old = new Date(options.pay_expire.replace(/-/g, "/"));
      let _now = new Date();
      let difference = _old.getTime() - _now.getTime();
      let h = Math.floor(difference/(1000*60*60));
      let m = Math.floor((difference - h * 1000 * 60 * 60)/(1000 * 60));
      let s = Math.floor((difference - m * 1000 * 60 - h * 1000 * 60 * 60)/1000);
      let showTime = h+ ":" + m + ":" + s;
      if(m<0 || s<0 || h<0){
        clearInterval(timer);
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
      this.setData({
        showTime: showTime
      })
    },1000)
    this.setData({
      tradeno: options.tradeno,
      pay_money: options.pay_money
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  /**
   * 支付
   */
  pay(){
    wx.showLoading({
      title: '正在拉取支付信息',
      mask:true
    })
    netWork.post('payment/unifiedOrder/wxpay',{
      type:'order',
      source:'xcx',
      tradeno: this.data.tradeno
    },(res)=>{
      wx.hideLoading()
      if(res.code==="000"){
        let param=JSON.parse(res.data.param);
        let formId = param.package.split('=')[1];
        console.log(formId,"prepay_id");
        app.saveFormId(formId, 2);
        wx.requestPayment({
          timeStamp: param.timeStamp,
          nonceStr: param.nonceStr,
          package: param.package,
          signType: param.signType,
          paySign: param.paySign,
          success:()=>{
            wx.showToast({
              title: '支付成功',
            });
            wx.redirectTo({
              url: '/pages/order/paysuccess/paysuccess?code=' + this.data.tradeno
            })
            // wx.switchTab({
            //   url: '/pages/mine/mine',
            //   success:()=>{
            //     wx.navigateTo({
            //       url: '/pages/order/list/list?type=2'
            //     })
            //   }
            // })
          },
          fail:()=>{
            wx.switchTab({
              url: '/pages/mine/mine',
              success: () => {
                wx.navigateTo({
                  url: '/pages/order/list/list?type=1'
                })
              }
            })
          }
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
      app.saveFormId(formId, 1);
    }
    console.log(formId);
  }
})