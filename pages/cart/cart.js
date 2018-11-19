// pages/cart/cart.js
const app = getApp();
const netWork=require("./../..//utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'4',
    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529647402466&di=d754a753ddb58eef176539afe2853947&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201501%2F14%2F20150114145326_sQPjW.jpeg',
    allchoose:false,
    goods:[],
    likeData:[],
    page:1,
    isShowNoData:false,
    storename:'',
    avator: '',
    isshowstore: false
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
  goonNew() {
    wx.navigateTo({
      url: '/pages/index/freeShipping/freeShipping?id=' + "1"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let otherUid = wx.getStorageSync('otherUid');
    let goods = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    for(let i=0;i<goods.length;i++){
      goods.check=false;
    }
    this.setData({
      goods: goods,
      allchoose:false
    })
    this.checkGoods();
    this.getGusessLike();
    this.getMyselfShopInfo();
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

  
 
  // 全选
  allchooseTap(){
    let allchoose = !this.data.allchoose;
    let goods=this.data.goods;
    for(let i=0;i<goods.length;i++){
      goods[i].check = allchoose;
    }
    this.setData({
      allchoose: allchoose,
      goods:goods
    })

  },
  /**
   * 去下单
   */
  goOrder(){
    if (getApp().globalData.user && !getApp().globalData.user.phone){
      wx.switchTab({
        url: '/pages/mine/mine',
      })
      return
    }
    if (getApp().globalData.user && getApp().globalData.user.is_code == 0){
      wx.navigateTo({
        url: '/pages/login/invitation/invitation',
      })
      return
    }
    let goods=this.data.goods;
    let items = [];
    for (var i = 0; i < goods.length; i++) {
      let item = {}, cartItem = goods[i];
      if (cartItem.check){
        item.goods_id = cartItem.id;
        item.sku_id = cartItem.sku_id;
        item.quantity = cartItem.num;
        items.push(item);
      }
    }
    if (items.length==0){
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
      return
    }
    wx.setStorageSync("orders", items);
    wx.navigateTo({
      url:'/pages/order/order'
    })
  },
  //添加数量
  addCar(e){
    var goods = this.data.goods;
    var index = e.currentTarget.dataset.index;
    goods[index].num++;
    this.setData({
      goods: goods
    })
    this.changeCart(goods[e.currentTarget.dataset.index]);
  },
  //减少
  reduceCar(e) {
    if (e.currentTarget.dataset.num <= 1) return;
    var goods = this.data.goods;
    var index = e.currentTarget.dataset.index;
    goods[index].num--;
    this.setData({
      goods: goods
    })
    this.changeCart(goods[e.currentTarget.dataset.index]);
  },
  // 修改本地商品数量
  changeCart(good){
    let otherUid = wx.getStorageSync('otherUid');
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    for(let i=0;i<cart.length;i++){
      if (cart[i].id==good.id){
        cart[i].num=good.num;
      }
    }
    wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
  },
  //选中商品
  checked(e){
    let goods=this.data.goods;
    let count=0;
    let allchoose = this.data.allchoose;
    var index = e.currentTarget.dataset.index;
    goods[index].check=!goods[index].check;
    for (let i = 0; i < goods.length; i++) {
      if(goods[i].check){
        count++;
      }
    }
    if (count == goods.length){
      allchoose = true;
    }else{
      allchoose = false;
    }
    this.setData({
      goods: goods,
      allchoose: allchoose
    })
  },
  /**
   * 检查购物车里的商品库存
   */
  checkGoods(){
    let goods=this.data.goods;
    let items = [];
    for (var i = 0; i < goods.length; i++) {
      let item = {}, cartItem = goods[i];
      item.goods_id = cartItem.id;
      item.sku_id = cartItem.sku_id;
      item.quantity = cartItem.num;
      items.push(item);
    };
    netWork.post('goods/checkGoods', { items: JSON.stringify(items)},(res)=>{

    })
  },

  /**
   * 删除购物车商品
   */
  deleGoods(){
    let otherUid = wx.getStorageSync('otherUid');
    let goods = this.data.goods;
    let items = [];
    for (var i = 0; i < goods.length; i++) {
      let cartItem = goods[i];
      if (!cartItem.check) {
        items.push(cartItem);
      }
    }
    this.setData({
      goods: items
    })
    wx.setStorageSync("cart"+otherUid, JSON.stringify(items));
  },
  //获取个人店信息
  getMyselfShopInfo(){
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
    let avator = app.globalData.user.avatar
    let param = {
      uid: otherUid
    }
    netWork.post('/userStore/storeInfo',param,res => {
      if(res.code === "000"){
        let myselfinfo = res.data.data;
        this.setData({
          storename: myselfinfo.name,
          avator: avator,
        });
        if(otherUid == uid){
          this.setData({
            isshowstore: false,
          })
        }else{
          this.setData({
            isshowstore: true,
          })
        }
      }
    })
  },
  /**
   * 前往首页
   */
  goindex(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //获取购物车数量
  getNum() {
    let otherUid = wx.getStorageSync('otherUid');
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    let num = 0;
    for (var i = 0; i < cart.length; i++) {
      num += cart[i].num;
    }
    if (num > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: num + ''
      })
    } else {
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
  },
  // 获取猜你喜欢
  getGusessLike(){
    let cate_id=[],
      goods_id=[];
    this.data.goods.forEach( el=>{
      cate_id.push(el.cate_id);
      goods_id.push(el.id)
    } )
    let params ={
          page: this.data.page, 
          limit:10,
          cate_id: cate_id.join(',')||"",
          goods_id: goods_id.join(',') || "",
      }
    netWork.post('/goods/amazeGoodsList', params ,res=>{
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
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  /**
   * 获取formId
   */
  getFromId(e){
    let formId=e.detail.formId;
    if (formId !="the formId is a mock one"){
      app.saveFormId(formId,1);
    }
    console.log(formId);
  },
  /**
   * 监听下拉事件
   */
  onPullDownRefresh() {
    let otherUid = wx.getStorageSync('otherUid');
    let goods = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    for (let i = 0; i < goods.length; i++) {
      goods.check = false;
    }
    this.setData({
      goods: goods,
      allchoose: false
    })
    this.checkGoods();
    this.getGusessLike();
    wx.stopPullDownRefresh();
  },
  /**
   * 修改购物车商品数量
   */
  changeNum(e){
    let num = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let goods = this.data.goods;
    goods[index].num=num-0;
    this.setData({
      goods:goods
    })
    this.changeCart(goods[e.currentTarget.dataset.index]);
  }
})