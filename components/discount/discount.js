// components/discount/discount.js
const netWork=require('../../utils/network.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    discountId:{
      type:String,
      value:''
    },
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel(){
      this.setData({
        show:false
      })
    },
    getDiscount(){
      /**
     * 判断是否注册
     */
      if (getApp().globalData.user && !getApp().globalData.user.phone) {
        wx.switchTab({
          url: '/pages/mine/mine',
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
      netWork.post("UserCoupon/receiveCoupon", { coupon_id: this.data.discountId},(res)=>{
        if(res.code==="000"){
          wx.showToast({
            title: '领取成功'
          })
          this.setData({
            show: false
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:"none"
          })
        }
      })
    }
  }
})
