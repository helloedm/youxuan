// pages/order/list/list.js
// var sliderWidth = 100; // 需要设置slider的宽度，用于计算中间位置
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "待付款", "待发货","待收货","已完成"],
    tabNav: ["全部订单", "待付款", "待发货", "待收货", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529647402466&di=d754a753ddb58eef176539afe2853947&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201501%2F14%2F20150114145326_sQPjW.jpeg',
    orderList:[],
    orderHead:'全部订单',
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      let sliderOffset = options.type * wx.getStorageSync("systemInfo").windowWidth / 5;
      this.setData({
        activeIndex: options.type,
        sliderOffset: sliderOffset,
        orderHead: this.data.tabNav[options.type]
      })
      // wx.setNavigationBarTitle({
      //   title: this.data.tabNav[options.type]
      // })
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
    this.setData({
      orderList:[]
    })
    this.getOrderList();
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
    this.setData({
      page:++this.data.page
    })
    this.getOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  tabClick: function (e) {
    let _this=this;
    console.log(e.currentTarget);
    _this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      orderHead: _this.data.tabNav[e.currentTarget.id]
    });
    wx.setNavigationBarTitle({
      title: _this.data.tabNav[e.currentTarget.id]
    })
    this.setData({
      page:1,
      orderList: []
    })
    this.getOrderList();
  },
  orderDetail(e){
    this.setData({
      orderList: []
    })
    console.log(e);
    let tradeno = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?tradeno=' + tradeno + '&from=sureget'
    })
  },
  /**
   * 获取订单列表
   */
  getOrderList(){
    let activeIndex = this.data.activeIndex;
    let status = activeIndex == 0?'0':activeIndex == 1 ? '1010' : activeIndex == 2 ? '2020' : activeIndex == 3 ? '2030' : '5000,5010,6030';
    netWork.post('order/index', { status: status, current_page: this.data.page, page_size:20},(res)=>{
      if(res.code==="000"){
        this.setData({
          orderList: [...this.data.orderList,...res.data.rows]
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
   * 去支付
   */
  gopay(e){
    console.log(e);
    let pay_expire = e.currentTarget.dataset.pay_expire;
    let pay_money = e.currentTarget.dataset.pay_money;
    let tradeno = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url:'/pages/order/payment/payment?tradeno=' + tradeno +
          '&pay_money=' + pay_money +
          '&pay_expire=' + pay_expire,
    })
  },
  /**
   * 取消订单
   */
  cancelOrder(e){
    let tradeno = e.currentTarget.dataset.tid;
    netWork.post('order/cancel', { tradeno: tradeno},(res)=>{
      this.setData({
        page:1,
        orderList:[]
      })
      this.getOrderList();
    })
  },
  /**
   * 确认收货
   */
  confirmReceived(e){
    console.log(e);
    let tradeno = e.currentTarget.dataset.tid;    
    wx.showModal({
      title: '提醒',
      content: '是否确认收货?',
      success: (res) => {
        if (res.confirm){
          netWork.post('order/confirmReceived', { tradeno: tradeno }, (res) => {
            this.setData({
              page: 1,
              orderList: []
            })
            this.getOrderList();
            wx.redirectTo({
              url: '/pages/order/paysuccess/paysuccess?code=' + tradeno + '&from=sureget',
            })
          })
        }
      }
    })
  },
  /**
   * 再来一单
   */
  again(e){
    let orderExt = e.currentTarget.dataset.item;
    let items=[];
    orderExt.forEach((item)=>{
      item.order_detail.forEach((item2)=>{
        let a={};
        a.goods_id = item2.goods_id;
        a.sku_id = item2.sku_id;
        a.quantity = item2.quantity;
        items.push(a);
      })
    })
    wx.setStorageSync("orders", items);
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },
  /**
   * 去往首页
   */
  goindex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})