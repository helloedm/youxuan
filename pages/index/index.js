//index.js
//获取应用实例
const app = getApp();
const netWork =require("../../utils/network.js");
const util = require("../../utils/util.js");
Page({
  data: {
    toView: '',
    scrollTop: 0,

    type:'1',
    page:1,
    shoppage: 1,
    recordpage:1,
    nonemore:false,
    noReqest:false,
    regCoupon:null,
    ismypage:true,
    isgivelove:true,
    isgomystore:true,
    isdeleshop: true,
    isshowstore: false,
    noshowstore: false,
    motto: 'Hello World',
    goodsid: '',
    goodskey: '',
    storeimg:'',
    storebackground_img:'',
    mystore: false,
    storedes:'',
    recordnum: '',
    recordavator: '',
    shopnum:'',
    storename:'',
    userInfo: {},
    rank:1,
    myselfgoodslist:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bodyList: [
      {
        id: 1,
        title: "发现"
      },
      {
        id: 2,
        title: "苏宁易购"
      },
      {
        id: 3,
        title: "美妆护肤"
      }, {
        id: 4,
        title: "外贸百货"
      }, {
        id: 5,
        title: "鞋类箱包"
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    panicOffset: wx.getStorageSync("systemInfo").windowWidth / 3,
    panicActive:1,
    sliderLeft: 0,
    imgUrls: [
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720345924_99.jpg',
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720347948_14.jpg',
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720349979_64.png'
    ],
    panicList:[],
    goods:[],
    num:0,//购物车数量
    isShowBtn:true,//是否显示按钮
    animationData:{},
    tip:"",
    scrollH: (() => {
      let systemInfo = wx.getSystemInfoSync();
      return systemInfo.windowHeight * (750 / systemInfo.windowWidth)
    })(),
    mainList:[],//首页推荐跑马灯
    cartList:[],//购买商品列表
    cartItem:null,
    showReg:false,
    showHongbao:true,
    showTop:false,
    showShare:false,
    detail:null,
    specialType:"2",
    specialArr2: [],
    startTime2: null,
    endTime2: null,
    panicArr: [
      { id: '1', title: '昨日特卖', tip: '已结束' },
      { id: '1', title: '今日特卖', tip: '抢购中' },
      { id: '1', title: '明日特卖', tip: '即将开始' }
    ],      
    timer1:null,
    h:0,
    m:0,
    s:0,
    isshowsale:false
  },
  /**
   * 页面
   */
  onShow: function () {
    this.getNum();
    if (app.globalData.user && app.globalData.user.is_receive == "0"){
      this.getRegCoupon();
    }
    let uid = wx.getStorageSync("storeId");
    let shoprecommend = wx.getStorageSync("shoprecommend");
    if(uid){
      wx.removeStorageSync('storeId')
      this.getMyselfShopInfo();
      this.getMyselfGoodsInfo();
      this.getgoodsList();
      this.addMypopleShop();
      this.addHistoryShop();
      this.storerecord();
    }
    if(shoprecommend){
      wx.removeStorageSync('shoprecommend')
      this.getMyselfGoodsInfo();
    }
    let gostore = wx.getStorageSync("gostore");
    if(gostore){
      wx.removeStorageSync('gostore')
      this.goMystores();
    }
  },
  onLoad: function (options) {
    // wx.setTabBarItem({
    //   index: 1,
    //   text: '选货中心',
    //   iconPath:'/images/cornucopia_0.png',
    //   selectedIconPath:'/images/cornucopia_0.png'
    // })
    /**
     * scence
     */
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let arr1 = scene.split("&");
      arr1.forEach((el) => {
        options[el.split('=')[0]] = el.split('=')[1];
      })
    }
    /**
     * 接受小程序分享者的邀请码
     */
    let invite_code="";
    if (options.invite_code || options.code){
      invite_code = options.invite_code || options.code;
      getApp().globalData.invite_code = invite_code;
    }
    //接受小程序分享者的店铺id
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    /**
     * 判断是否已经登录
     * 是否第一次进入
     */
    if (getApp().globalData.user){

        let user = getApp().globalData.user;
        if (user.is_receive == "0" && user.phone && user.is_code == "1") {//当前用户没有领取注册优惠券
          this.getRegCoupon();
        }
        //获取商品列表
        this.init();
    }else{
        getApp().getUserInfo(invite_code).then((res) => {
          if (res.data.is_receive == "0" && res.data.phone && res.data.is_code=="1") {//当前用户没有领取注册优惠券
            this.getRegCoupon();
          }
          //获取商品列表
          this.init();
        })
    }
    // 商品热卖倒计时
    setInterval(() => {
      if (false) {
        let result = this.data.endTime2 * 1000 - new Date().getTime();
        this.setData({
          h: new Date(result).getHours(),
          m: new Date(result).getMinutes(),
          s: new Date(result).getSeconds()
        })
      } else {
        this.setData({
          h: 23 - new Date().getHours(),
          m: 59 - new Date().getMinutes(),
          s: 60 - new Date().getSeconds()
        })
      }
    }, 1000)
  },
  /**
   * init 页面初次加载
   */
  init(){
    this.getHistoryShopId();
    this.specialGoodsList2();
    this.getgoodsList();
    this.commission();
    this.getcartList();
  },
  // 分享小程序
  onShareAppMessage: function (res) {
    let otherUid = wx.getStorageSync("otherUid");
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title:this.data.detail.title,
        path: "pages/goods/detail/detail?id=" + this.data.detail.id + "&invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
        imageUrl: this.data.detail.main_pic
      }
    }
    return {
      title: '爱聚优选  精选好物特卖平台',
      path: "/pages/index/index?invite_code=" + getApp().globalData.user.invite_code  + "&userid=" + otherUid,
      imageUrl:"https://youxuan.ecbao.cn/share.png"
    }
  },
  upper: function (e) {
    // console.log(e)
  },
  lower: function (e) {
    // console.log(e)
  },
  scroll: function (e) {
    // console.log(e)
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 获取特卖商品
  specialGoodsList2() {
    netWork.post("goods/specialGoodsList", {
      page: 1,
      limit: 10,
      special_name: "today"
    }, (res) => {
      if (res.code == "000" && res.data.data.length != 0) {
        this.setData({
          specialArr2: res.data.data,
          startTime2: new Date(res.data.special_start_time.replace(/\-/g, '/')).getTime() || null,
          endTime2: new Date(res.data.special_end_time.replace(/\-/g, '/')).getTime() || null,
        })
        if (new Date().getTime() > this.data.startTime2 & new Date().getTime() < this.data.endTime2){
          this.setData({
            isshowsale:true
          })
        }
      }
    })
  },
  // 添加 修改购物车
  openCar(e){
    let goods = this.data.goods;
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num;
    let sku_type = e.currentTarget.dataset.skutype;
    let on_sale = e.currentTarget.dataset.on_sale;
    if (sku_type == "2" || on_sale=="2"){
      wx.navigateTo({
        url: '/pages/goods/detail/detail?id=' + goods[index].id
      })
      return
    }
    goods[index].num += num;
    this._addCart(goods, index);
    this.setData({
      goods:goods
    })
  },
  //进入商品详情
  detail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  /*
    获取注册优惠券
  */
  getRegCoupon(){
    netWork.get("UserCoupon/getRegCoupon",{},(res)=>{
      if(res.code==="000"){
        if(res.data && res.data.length!=0){
          this.setData({
            regCoupon:res.data,
            showReg:true
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  /*
    获取首页商品列表
  */
  getgoodsList(callback){
    this.setData({
      nonemore: false
    })
    let otherUid = wx.getStorageSync('otherUid');
    netWork.post('/goods/amazeGoodsList', { page: this.data.page, limit:10,cate_id:'',goods_id:''},(res)=>{
      if(res.code==="000"){
        let goods=res.data.data;
        let cartList = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
        for(var j=0;j < goods.length;j++){
          goods[j].num = 0;
          for(var i=0;i<cartList.length;i++){
            if(cartList[i].id==goods[j].id){
              goods[j].num = cartList[i].num;
              break
            }
          }
        }
        if(goods.length < 10){//数据
          this.setData({
            noReqest: true
          })
        }
        this.setData({
          goods: this.data.goods.concat(goods),
          nonemore:true
        })
        callback && callback();
      }
    })
  },
  /**
   * 滚动到底部加载更多
   * 
   */
  onReachBottom(e){
    this.setData({
      page:++this.data.page
    })
    this.getgoodsList()
  },
  
  /*
  根据goods的num添加打本地存储
  goods 必传 商品列表
  index 非必传 当前商品的下标
  */
  _addCart(goods,index){
    let otherUid = wx.getStorageSync('otherUid');
    if(index){
      let cart=wx.getStorageSync("cart"+otherUid)?JSON.parse(wx.getStorageSync("cart"+otherUid)):[];
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == goods[index].id && cart[i].sku_id == goods[index].sku_id){
          cart[i].num=goods[index].num;
          wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
          return
        }
      }
      cart.push(goods[index]);
      wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
    }else{
      let cart=[];
      for (var i = 0; i < goods.length; i++) {
        if(goods[i].num>0){
          cart.push(goods[i]);
        }
      }
      wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
    }
    this.getNum();
  },
  //获取购物车数量
  getNum() {
    let otherUid = wx.getStorageSync('otherUid');
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    let num = 0;
    for (var i = 0; i < cart.length; i++) {
      num += cart[i].num;
    }
    if(num>0){
      wx.setTabBarBadge({
        index: 2,
        text: num+''
      })
    } else {
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
  },
  //推荐商品
  goRecommend(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/recommend/recommend?id=' + id,
    })
  },
  //获取个人店商品列表
  getMyselfGoodsInfo(){
    let otherUid = wx.getStorageSync("otherUid");
    let param = {
      uid: otherUid,
      page: this.data.shoppage,
      limit: 100
    }
    netWork.post('/userStoreGoods/GoodsStoreList',param,res => {
      if(res.code === "000"){
        if(res.data != ""){
          const myselfgoodslist = res.data.data;
          this.setData({
            myselfgoodslist: myselfgoodslist,
            shopnum: res.data.total,
          })
        }
      }
    })
  },
  //获取个人店信息
  getMyselfShopInfo(){
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
    let vip = app.globalData.user.rank;
    let param = {
      uid: otherUid
    }
    netWork.post('/userStore/storeInfo',param,res => {
      if(res.code === "000"){
        let myselfinfo = res.data.data;
        this.setData({
          storeimg: myselfinfo.img,
          storebackground_img: myselfinfo.background_img,
          storedes: myselfinfo.des,
          storename: myselfinfo.name,
          isshowstore: true,
          noshowstore: false,
        });
        if(otherUid != uid){ //是否是自己的店铺
          this.setData({
            ismypage: true,//不可以编辑
          })
          wx.setTabBarItem({
            index: 1,
            text: '全部商品',
            iconPath: '',
            selectedIconPath: ''
          })
        }else{
          this.setData({
            ismypage: false,//可以编辑
          })
          wx.setTabBarItem({
            index: 1,
            text: '选货中心',
            iconPath: '',
            selectedIconPath: ''
          })
        }
        if(vip == 2){ //是有自己的店铺可以返回
          if(this.data.ismypage){
            this.setData({
              isgomystore: false,
            })
          }else{
            this.setData({
              isgomystore: true,
            })
          }
        }
      }else{
        if(otherUid != uid){ //是否是自己的店铺
          this.setData({
            ismypage: true,//不可以编辑
          })
          wx.setTabBarItem({
            index: 1,
            text: '全部商品',
            iconPath: '',
            selectedIconPath: ''
          })
        }else{
          this.setData({
            ismypage: false,//可以编辑
          })
          wx.setTabBarItem({
            index: 1,
            text: '选货中心',
            iconPath: '',
            selectedIconPath: ''
          })
        }
        if(vip == 2){ //是有自己的店铺可以返回
          if(this.data.ismypage){
            this.setData({
              isgomystore: false,
            })
          }else{
            this.setData({
              isgomystore: true,
            })
          }
        }
        this.setData({
          isshowstore: false,
          noshowstore: true,
        })
      }
    })
  },
  //获取最近历史浏览店铺uid
  getHistoryShopId(){
    let params = {
      visit_uid: 1,
    }
    let vip = app.globalData.user.rank
    let otherUid = wx.getStorageSync('otherUid');
    if(otherUid == ''){
      netWork.post("/userStoreGoods/getHistoryUid",params,(res)=>{
        if(res.code=="000"){
          const HistoryUid = res.data.HistoryUid;
          wx.setStorageSync('otherUid', HistoryUid);
          this.getMyselfShopInfo();
          this.getMyselfGoodsInfo();
          this.addMypopleShop();
          this.addHistoryShop();
          this.storerecord();
        }
      })
    }else{
      if(vip != 2){
        netWork.post("/userStoreGoods/getHistoryUid",params,(res)=>{
          if(res.code=="000"){
            const HistoryUid = res.data.HistoryUid;
            wx.setStorageSync('otherUid', HistoryUid);
            this.getMyselfShopInfo();
            this.getMyselfGoodsInfo();
            this.addMypopleShop();
            this.addHistoryShop();
            this.storerecord();
          }
        })
      }else{
        this.getMyselfShopInfo();
        this.getMyselfGoodsInfo();
        this.addMypopleShop();
        this.addHistoryShop();
        this.storerecord();
      }
    }
  },
  //添加到访过我的店
  addMypopleShop(){
    let uid = wx.getStorageSync("otherUid");
    let params = {
      store_uid: uid,
    }
    netWork.post("/userStore/visitStoreAdd",params,(res)=>{
      if(res.code=="000"){
      }
    })
  },
  //添加历史访问个人店
  addHistoryShop(){
    let uid = wx.getStorageSync("otherUid");
    let params = {
      store_uid: uid,
    }
    netWork.post("/userStore/historyStoreAdd",params,(res)=>{
      if(res.code=="000"){
      }
    })
  },
  //编辑商品
  goRecommend(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/recommend/recommend?id=' + id,
    })
  },
  //编辑店铺
  editMystores(){
    wx.navigateTo({
      url: '/pages/index/mystores/mystores'
    })
  },
  //回到我的店铺
  goMystores(){
    let uid = app.globalData.user.id;
    wx.setStorageSync('otherUid', uid);
    this.getMyselfShopInfo();
    this.getMyselfGoodsInfo();
    this.storerecord();
    this.getNum();
  },
  //弹出删除商品弹框
  deletStoreShops(e){
    let id = e.currentTarget.dataset.id;
    let key = e.currentTarget.dataset.key;
    this.setData({
      goodsid:id,
      goodskey:key,
      isdeleshop: false,
    })
  },
  //删除商品
  deleshop(){
    let id = this.data.goodsid;
    let key = this.data.goodskey;
    let myselfgoodslist = this.data.myselfgoodslist;
    myselfgoodslist.splice(key,1);
    netWork.post("/userStoreGoods/deleteGoods",{goods_id:id},(res)=>{
      if(res.code=="000"){
        this.setData({
          goodsid:'',
          goodskey:'',
          isdeleshop: true,
          myselfgoodslist: myselfgoodslist,
        })
        wx.showToast({
          title: '删除成功',
          icon:'none'
        })
      }
    })
  },
  //关闭删除商品弹框
  cancelshop(){
    this.setData({
      goodsid:'',
      goodskey:'',
      isdeleshop: true,
    })
  },
  //更多访问者
  goVisitor(){
    wx.navigateTo({
      url: '/pages/index/visitor/visitor'
    })
  },
  //商品点赞
  giveshopthumbs(e){
    let id = e.currentTarget.dataset.id;
    let key = e.currentTarget.dataset.key;
    let myselfgoodslist = this.data.myselfgoodslist;
    let uid = app.globalData.user.id;
    let params = {
      store_goods_id: id,
      click_uid: uid,
    }
    if(this.data.isgivelove){
      this.setData({
        isgivelove:false
      })
      netWork.post("userStoreGoods/addGoodsclickNum",params,(res)=>{
        if(res.code=="000"){
          myselfgoodslist[key].click_num = Number(myselfgoodslist[key].click_num) + 1;
          this.setData({
            myselfgoodslist: myselfgoodslist,
            isgivelove:true
          })
          wx.showToast({
            title: '点赞成功',
            icon:'none'
          })
        }else{
          this.setData({
            isgivelove:true
          })
        }
      })
    }
  },
  /**
   * commission 获取跑马灯数据
   */
  commission(){
    netWork.get('commission/mainList',{},(res)=>{
      if(res.code==="000"){
        this.setData({
          mainList:res.data
        })
      }
    })
  },
  /**
   * 监听下拉事件
   */
  onPullDownRefresh (){
    this.setData({
      page: 1,
      goods:[]
    })
    this.init();
    this.getgoodsList(()=>{
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 获取购买列表
   */
  getcartList(){
    netWork.get("banner/cartList",{},(res)=>{
      if(res.code==="000" && res.data.length > 0){
        clearInterval(this.data.timer1);
        let i = 0;
        let timer1 = setInterval(()=>{
          this.setData({
            cartItem: res.data[i]
          })
          i++;
          if(i==res.data.length){
            i=0;
          }
          setTimeout(()=>{
            this.setData({
              cartItem: null
            })
          },2000)
        },5000)
        this.setData({
          cartList:res.data,
          timer1: timer1
        })
      }
    })
  },
  /**
   * 去
   */
  goassurance(){
    wx.navigateTo({
      url: '/pages/index/assurance/assurance'
    })
  },
  exclusive(){
    wx.navigateTo({
      url: '/pages/vip/month/month',
    })
  },
  goSvip(){
    wx.navigateTo({
      url: '/pages/vip/vip'
    })
  },
  /**访问店铺记录 */
  storerecord(){
    let otherUid = wx.getStorageSync("otherUid");
    let params = {
      uid: otherUid,
      limit: 5,
      page: this.data.recordpage,
    }
    netWork.post('/userStore/visitStoreList', params, res => {
      if(res.code==="000"){
        this.setData({
          recordavator: res.data.data,
          recordnum: res.data.total
        })
      }
    })
  },
  /**
   * 页面滚动关闭红包显示
   * 
   */
  hideHongbao(e){
    this.setData({
      showHongbao:false
    })
  },
  /**
   * 打开红包提示
   */
  showHongbaoF(e){
    if (e.changedTouches[0].pageY > 1000){
      this.setData({
        showTop:true,
        showHongbao: true
      })
    }else{
      this.setData({
        showTop: false,
        showHongbao: true
      })
    }
  },
  toHongbao(){
    wx.navigateTo({
      url: '/pages/mine/invitation/invitation',
    })
  },
  toTop(){
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      showTop: false
    })
  },
  /**
   * 分享单个商品
   */
  shareGoods(e){
    let item=e.currentTarget.dataset.item;
    this.setData({
      detail:item,
      showShare:true
    })
    wx.hideTabBar();
  },
  category(e){
    let val=e.currentTarget.dataset.val;
    wx.navigateTo({
      url: '/pages/index/category/category?val=' + val
    })
  }
})
