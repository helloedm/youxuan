// pages/index/freeShipping/freeShipping.js
var netWork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paysuccess:'支付成功',
    listData: [],
    isShowNoData: false,
    page: 1,
    id: 1,
    image: '',
    likeData: [], 
    showShare: false,
    canvasHidden:false,
    detail:null,
    pay_money:'-',
    sureget:false,
    code:null//订单编码  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let otherUid = wx.getStorageSync("otherUid");
    return {
      title: '爱聚优选  精选好物特卖平台',
      path: "pages/goods/detail/detail?id=" + this.data.detail.id + "&invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
      imageUrl: this.data.detail.main_pic
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.code) {
      this.setData({
        code: options.code,
      })
    }
    if (options.from) {
      this.setData({
        paysuccess:'交易完成',
        sureget: true,
      })
    }
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    this.getData();//已购买物品    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
  * 展示分享选择框
  */
  showShareFn(e) {
    this.setData({
      showShare: true,
      detail: e.currentTarget.dataset.item
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGusessLike();//猜你喜欢    
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
    this.getGusessLike();    
  },
  // 获取数据
  getData() {
    
    let params = {
      tradeno: this.data.code
    }
    netWork.post('order/paySuccess', params, res => {
      if (res.code == "000") {
        this.setData({
          listData: res.data.goods,
          pay_money: res.data.order.pay_money,
          detail: res.data.goods[0],
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //返回首页
  backhomepage(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //查看订单
  checkorder(){
    if (this.data.sureget){
      wx.navigateTo({
        url: '/pages/order/list/list?type=4'
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/list/list?type=2'
      })
    }
  },
  //进入商品详情
  detail(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  // 获取猜你喜欢
  getGusessLike() {
    // let cate_id = [],
    //   goods_id = [];
    // this.data.goods.forEach(el => {
    //   cate_id.push(el.cate_id);
    //   goods_id.push(el.id)
    // })
    let params = {
      page: this.data.page,
      limit: 10,
      // cate_id: cate_id.join(',') || "",
      // goods_id: goods_id.join(',') || "",
    }
    netWork.post('/goods/amazeGoodsList', params, res => {
      if (res.code == "000") {
        this.data.page++
        if (res.data.data.length < res.data.limit && res.data.data.length == 0) {
          this.setData({
            isShowNoData: true
          })
        } else {
          if (this.data.page == 1) {
            this.setData({
              isShowNoData: true
            })
          } else {
            this.setData({
              isShowNoData: false
            })
          }
          this.setData({
            likeData: [...this.data.likeData, ...res.data.data],
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})