// pages/order/orderDetail/orderDetail.js
const netWork=require('../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529647402466&di=d754a753ddb58eef176539afe2853947&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201501%2F14%2F20150114145326_sQPjW.jpeg',
    tradeno:null,
    detail:{},
    m:0,
    s:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tradeno){
      this.setData({
        tradeno: options.tradeno
      })
    }
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
    this.getDetail();
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
   * 获取订单详情
   */
  getDetail(){
    netWork.post('order/detail', { tradeno: this.data.tradeno},(res)=>{
      if (res.data.status.code =="1010"){
        this.computeTime(res.data.pay_expire.alias);
      }
      this.setData({
        detail:res.data
      })
    })
  },
  /**
   * 计算倒计时
   */
  computeTime(time){
    let timer = setInterval(() => {
      let _old = new Date(time.replace(/-/g, "/"));
      let _now = new Date();
      let difference = _old.getTime() - _now.getTime();
      // let h = Math.floor(difference / (1000 * 60 * 60));
      let m = Math.floor(difference / (1000 * 60));
      let s = Math.floor((difference - m * 1000 * 60) / 1000);
      if (m < 0 || s < 0) {
        clearInterval(timer);
        wx.navigateBack();
      }
      this.setData({
        m: m,
        s: s
      })
      
    }, 1000)
  },
  /**
   * 取消订单
   */
  cancelOrder(e) {
    let tradeno = e.currentTarget.dataset.tid;
    netWork.post('order/cancel', { tradeno: tradeno }, (res) => {
      wx.showToast({
        title: '取消成功',
        success:()=>{
          wx.navigateBack();
        }
      })
    })
  },
  /**
   * 去支付
   */
  gopay(e) {
    console.log(e);
    let pay_expire = e.currentTarget.dataset.pay_expire;
    let pay_money = e.currentTarget.dataset.pay_money;
    let tradeno = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/order/payment/payment?tradeno=' + tradeno +
      '&pay_money=' + pay_money +
      '&pay_expire=' + pay_expire,
    })
  },
  /**&
   * 确认收货
   */
  affirm(e){
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提醒',
      content: '是否确认收货?',
      success: (res) => {
        if (res.confirm){
          netWork.post('order/confirmReceived', { detail_id: id }, (res) => {
            wx.showToast({
              title: '确认收货成功',
              success: () => {
                this.getDetail();
                wx.redirectTo({
                  url: '/pages/order/paysuccess/paysuccess?code=' + this.data.detail.tid + '&from=sureget',
                })
              }
            })
          })
        }
      }
    })
  },
  //查看物流
  logistics(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let logistics_company = e.currentTarget.dataset.logistics_company;
    wx.navigateTo({
      url: '/pages/order/logistics/logistics?id=' + id + '&logistics_company=' +logistics_company,
    })
  },
  /**
   * 复制订单编号
   */
  copyNo(e){
    let no= e.currentTarget.dataset.no;
    wx.setClipboardData({
      data: no,
      success: () => {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  /**&
   * 打开商品详情
   */
  goGoodsDetail(e){
    let goodsId=e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `/pages/goods/detail/detail?id=${goodsId}`,
    })
  }
})