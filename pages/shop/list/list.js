// pages/shop/list/list.js
const netWork = require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    mid:null,
    lists:[],
    isShowBtn: true,
    num:"0",
    nonemore:false,
    requsetd:true,
    shop_name:'',
    showShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let arr1 = scene.split("&");
      arr1.forEach((el) => {
        options[el.split('=')[0]] = el.split('=')[1];
      })
    }
    if(options.mid){
      this.setData({
        mid:options.mid
      })
    }
    /**
     * 接受小程序分享者的邀请码
     */
    if (options.invite_code || options.code) {
      getApp().globalData.invite_code = options.invite_code || options.code;
    }
    if (getApp().globalData.user) {
      this.getShopGoods();
    } else {
      getApp().getUserInfo().then((res) => {
        //获取商品列表
        this.getShopGoods();
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
    this.getShopGoods();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shop_name,
      path: 'pages/shop/list/list?mid=' + this.data.mid + "&invite_code" + getApp().globalData.user.invite_code
    }
  },
  /**
   * 获取商铺商品列表
   */
  getShopGoods(){
    let mid = this.data.mid;
    let page=this.data.page;
    netWork.post('goods/merchantGoodList', { mid: mid, page: page, limit:10},(res)=>{
      if (res.code === "000") {
        wx.setNavigationBarTitle({
          title: res.data.shop_name
        })
        this.setData({
          shop_name: res.data.shop_name
        })
        let otherUid = wx.getStorageSync('otherUid');
        let goods = res.data.data;
        let cartList = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
        console.log(cartList);
        for (var j = 0; j < goods.length; j++) {
          goods[j].num = 0;
          for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].id == goods[j].id) {
              goods[j].num = cartList[i].num;
              break
            }
          }
        }
        if (goods.length < 10) {//数据
          this.setData({
            nonemore: true
          })
        }
        this.setData({
          lists: this.data.lists.concat(goods)
        })
      }
    })
  },
  //进入商品详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  showShareFn(){
    this.setData({
      showShare:true
    })
  }
})