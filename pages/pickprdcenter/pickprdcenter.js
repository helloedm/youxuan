//index.js
//获取应用实例
const app = getApp()
const netWork = require("../../utils/network.js");
const util = require("../../utils/util.js");
Page({
  data: {
    type: '1',
    page: 1,
    nonemore: false,
    noReqest: false,
    regCoupon: null,
    ismypage: true,
    motto: 'Hello World',
    storeimg: '',
    storebackground_img: '',
    mystore: false,
    storedes: '',
    storename: '',
    userInfo: {},
    myselfgoodslist: [],
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
    panicActive: 1,
    sliderLeft: 0,
    imgUrls: [
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720345924_99.jpg',
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720347948_14.jpg',
      'http://pax6ums6h.bkt.clouddn.com//goods/1531720349979_64.png'
    ],
    panicArr: [
      { id: '1', title: '昨日特卖', tip: '已结束' },
      { id: '1', title: '今日特卖', tip: '抢购中' },
      { id: '1', title: '明日特卖', tip: '即将开始' }
    ],
    panicList: [],
    goods: [],
    num: 0,//购物车数量
    isShowBtn: true,//是否显示按钮
    animationData: {},
    tip: "",
    scrollH: (() => {
      let systemInfo = wx.getSystemInfoSync();
      return systemInfo.windowHeight * (750 / systemInfo.windowWidth)
    })(),
    mainList: [],//首页推荐跑马灯
    cartList: [],//购买商品列表
    cartItem: null,
    activityList: [],
    showReg: false,
    showHongbao: true,
    showTop: false,
    showShare: false,
    detail: null,
    specialArr1: [],
    specialArr2: [],
    specialArr3: [],
    startTime1: null,
    startTime2: null,
    startTime3: null,
    endTime1: null,
    endTime2: null,
    endTime3: null,
    specialType: "2",
    classify: [
      {
        // tip: 'https://youxuan.ecbao.cn/goods/1535094396422_28.png',//食品生鲜
        tip:'http://youxuan.ecbao.cn/material/1539658701898_95.png',
        text:'食品生鲜',
        arr: [],
        val: '1',
      },
      {
        // tip: 'https://youxuan.ecbao.cn/goods/1535094332021_42.png',//家居生活
        tip:'http://youxuan.ecbao.cn/material/1539658763947_94.png',
        text: '家居生活',
        arr: [],
        val: '3',
        title: ''
      },
      {
        // tip: 'https://youxuan.ecbao.cn/goods/1535094382576_23.png',//母婴玩具
        tip: 'http://youxuan.ecbao.cn/material/1539658804081_82.png',
        text: '母婴玩具',
        arr: [],
        val: '2'
      },
      {
        // tip: 'https://youxuan.ecbao.cn/goods/1535094368833_21.png',//美妆个护
        tip: 'http://youxuan.ecbao.cn/material/1539658837305_29.png',//美妆个护
        arr: [],
        val: '4',
        text: '美妆个护',
      },
      {
        // tip: 'https://youxuan.ecbao.cn/goods/1535094417822_18.png',//服饰箱包
        tip: 'http://youxuan.ecbao.cn/material/1539658861122_38.png',//服饰箱包
        arr: [],
        text: '服饰箱包',
        val: '5'
      }
    ],
    timer1: null,
    recommendid:null //推荐到首页
  },
  /**
   * 页面
   */
  onShow: function () {
    this.getNum();
    this.isMyPage();
    if (app.globalData.user && app.globalData.user.is_receive == "0") {
      this.getRegCoupon();
    }
    this.getActivityList();
    if (wx.getStorageSync("recommendid")){
      let number_key = Number(wx.getStorageSync("recommendid"));
      this.data.goods[number_key].isStoreGoods = 1
      let newdata = this.data.goods
      this.setData({
        goods: newdata
      })
      wx.removeStorageSync("recommendid")
    }
  },
  onLoad: function (options) {
    this.init(options);
  },
  /**
   * init 页面初次加载
   */
  init(options) {
    this.isMyPage();
    this.getgoodsList();
    this.commission();
    this.getcartList();
    this.getActivityList();
    // this.specialGoodsList1();
    this.specialGoodsList2();
    // this.specialGoodsList3();
    // this.getCateGoodsList();
  },
  // 分享小程序
  onShareAppMessage: function (res) {
    let otherUid = wx.getStorageSync("otherUid");
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: this.data.detail.title,
        path: "pages/goods/detail/detail?id=" + this.data.detail.id + "&invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
        imageUrl: this.data.detail.main_pic
      }
    }
    return {
      title: '爱聚优选  精选好物特卖平台',
      path: "/pages/index/index?invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
      imageUrl: "https://youxuan.ecbao.cn/share.png"
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tabClick: function (e) {
    var id = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: id,
    });
  },
  panicClick(e) {
    let id = e.currentTarget.id;
    this.setData({
      panicOffset: e.currentTarget.offsetLeft,
      panicActive: id
    })
  },
  // 添加 修改购物车
  openCar(e) {
    let goods = this.data.goods;
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num;
    let sku_type = e.currentTarget.dataset.skutype;
    let on_sale = e.currentTarget.dataset.on_sale;
    if (sku_type == "2" || on_sale == "2") {
      wx.navigateTo({
        url: '/pages/goods/detail/detail?id=' + goods[index].id
      })
      return
    }
    goods[index].num += num;
    this._addCart(goods, index);
    this.setData({
      goods: goods
    })
  },
  //进入搜索
  search(e){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //进入商品详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  //推荐商品
  goRecommend(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/goods/recommend/recommend?id=' + id + '&key=' + key,
    })
  },
  /*
    获取注册优惠券
  */
  getRegCoupon() {
    netWork.get("UserCoupon/getRegCoupon", {}, (res) => {
      if (res.code === "000") {
        if (res.data && res.data.length != 0) {
          this.setData({
            regCoupon: res.data,
            showReg: true
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 判断是自己页面
  isMyPage() {
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
    if(otherUid != uid){ //是否是自己的店铺
      this.setData({
        ismypage: true,//不可以编辑
      })
    }else{
      this.setData({
        ismypage: false,//可以编辑
      })
      wx.setNavigationBarTitle({
        title: '选货中心',
      })
    }
  },
  /*
    获取首页商品列表
  */
  getgoodsList(callback) {
    this.setData({
      nonemore: false
    })
    let otherUid = wx.getStorageSync('otherUid');
    netWork.post('goods/goodsList', { page: this.data.page, limit: 10, cate_id: '' }, (res) => {
      if (res.code === "000") {
        let goods = res.data.data;
        let cartList = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
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
            noReqest: true
          })
        }
        this.setData({
          goods: [...this.data.goods, ...res.data.data],
          nonemore: true
        })
        callback && callback();
      }
    })
  },
  /**
   * 滚动到底部加载更多
   * 
   */
  onReachBottom(e) {
    this.setData({
      page: ++this.data.page
    })
    this.getgoodsList()
  },
  /*
  根据goods的num添加打本地存储
  goods 必传 商品列表
  index 非必传 当前商品的下标
  */
  _addCart(goods, index) {
    let otherUid = wx.getStorageSync('otherUid');
    if (index) {
      let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == goods[index].id && cart[i].sku_id == goods[index].sku_id) {
          cart[i].num = goods[index].num;
          wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
          return
        }
      }
      cart.push(goods[index]);
      wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
    } else {
      let cart = [];
      for (var i = 0; i < goods.length; i++) {
        if (goods[i].num > 0) {
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
  /**
   * commission 获取跑马灯数据
   */
  commission() {
    netWork.get('commission/mainList', {}, (res) => {
      if (res.code === "000") {
        this.setData({
          mainList: res.data
        })
      }
    })
  },
  /**
   * 监听下拉事件
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      goods: []
    })
    this.init();
    this.getgoodsList(() => {
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 获取购买列表
   */
  getcartList() {
    netWork.get("banner/cartList", {}, (res) => {
      if (res.code === "000" && res.data.length > 0) {
        clearInterval(this.data.timer1);
        let i = 0;
        let timer1 = setInterval(() => {
          this.setData({
            cartItem: res.data[i]
          })
          i++;
          if (i == res.data.length) {
            i = 0;
          }
          setTimeout(() => {
            this.setData({
              cartItem: null
            })
          }, 2000)
        }, 5000)
        this.setData({
          cartList: res.data,
          timer1: timer1
        })
      }
    })
  },
  /**
   * 去
   */
  goassurance() {
    wx.navigateTo({
      url: '/pages/index/assurance/assurance'
    })
  },
  /**
   * 前往今日上新
   */
  goonNew(e) {
    let id = e.currentTarget.dataset.id;
    if (id == 19) {
      wx.navigateTo({
        url: '/pages/index/lover/lover?id=' + id
      })
    } else if (id == "vip") {
      this.goSvip();
    } else {
      wx.navigateTo({
        url: '/pages/index/freeShipping/freeShipping?id=' + id
      })
    }
  },
  exclusive() {
    wx.navigateTo({
      url: '/pages/vip/month/month',
    })
  },
  goSvip() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    })
  },
  /**
   * 获取活动列表
   */
  getActivityList() {
    netWork.get("goods/activityList", {}, (res) => {
      if (res.code == "000") {
        let active = {
          image: 'http://youxuan.ecbao.cn/material/1535532379778_9.png',
          id: 'vip'
        }
        let data = res.data.data;
        data.push(active)
        this.setData({
          activityList: data
        })
      }
    })
  },
  /**
   * 页面滚动关闭红包显示
   * 
   */
  hideHongbao(e) {
    this.setData({
      showHongbao: false
    })
  },
  /**
   * 打开红包提示
   */
  showHongbaoF(e) {
    if (e.changedTouches[0].pageY > 1000) {
      this.setData({
        showTop: true,
        showHongbao: true
      })
    } else {
      this.setData({
        showTop: false,
        showHongbao: true
      })
    }
  },
  toHongbao() {
    wx.navigateTo({
      url: '/pages/mine/invitation/invitation',
    })
  },
  toTop() {
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
  shareGoods(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      detail: item,
      showShare: true
    })
    wx.hideTabBar();
  },
  /**
   * 获取特卖商品列表昨天
   */
  specialGoodsList1() {
    netWork.post("goods/specialGoodsList", {
      page: 1,
      limit: 10,
      special_name: "yesterday"
    }, (res) => {
      if (res.code == "000" && res.data.data.length != 0) {
        this.setData({
          specialArr1: res.data.data,
          startTime1: new Date(res.data.special_start_time.replace(/\-/g, '/')).getTime() || null,
          endTime1: new Date(res.data.special_end_time.replace(/\-/g, '/')).getTime() || null,
        })
      }
    })
  },
  /**
   * 获取特卖商品列表
   */
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
        let startTime2 = new Date(res.data.special_start_time.replace(/\-/g, '/')).getTime() || null;
        let endTime2 = new Date(res.data.special_end_time.replace(/\-/g, '/')).getTime() || null;
        let panicArr = this.data.panicArr;
        let nowD = new Date().getTime();
        if (nowD < startTime2) {
          console.log(startTime2);
          let h = new Date(startTime2).getHours() < 10 ? "0" + new Date(startTime2).getHours() : new Date(startTime2).getHours();
          let m = new Date(startTime2).getMinutes() < 10 ? "0" + new Date(startTime2).getMinutes() : new Date(startTime2).getMinutes()
          panicArr[1].tip = h + ":" + m + "开抢";
          this.setData({
            panicArr: panicArr
          })
        }
      }
    })
  },
  /**
   * 获取特卖商品列表
   */
  specialGoodsList3() {
    netWork.post("goods/specialGoodsList", {
      page: 1,
      limit: 10,
      special_name: "tomorrow"
    }, (res) => {
      if (res.code == "000" && res.data.data.length != 0) {
        this.setData({
          specialArr3: res.data.data,
          startTime3: new Date(res.data.special_start_time.replace(/\-/g, '/')).getTime() || null,
          endTime3: new Date(res.data.special_end_time.replace(/\-/g, '/')).getTime() || null,
        })
        let startTime3 = new Date(res.data.special_start_time.replace(/\-/g, '/')).getTime() || null;
        let panicArr = this.data.panicArr;
        let nowD = new Date().getTime();
        let h = new Date(startTime3).getHours() < 10 ? "0" + new Date(startTime3).getHours() : new Date(startTime3).getHours();
        let m = new Date(startTime3).getMinutes() < 10 ? "0" + new Date(startTime3).getMinutes() : new Date(startTime3).getMinutes()
        panicArr[2].tip = h + ":" + m + "开抢";
        this.setData({
          panicArr: panicArr
        })
      }
    })
  },
  getCateGoodsList() {
    netWork.post("goods/getCateGoodsList", {
      page: 1,
      limit: 9
    }, res => {
      if (res.code == "000") {
        let classify = this.data.classify;
        classify[4].arr = res.data.fashion.data;//服饰箱包
        classify[1].arr = res.data.life.data;//家居生活
        classify[3].arr = res.data.beauty.data;//美妆个护
        classify[2].arr = res.data.toys.data;//母婴玩具
        classify[0].arr = res.data.food.data;//食品生鲜
        this.setData({
          classify: classify
        })
      }
    })
  },
  category(e) {
    let val = e.currentTarget.dataset.val;
    wx.navigateTo({
      url: '/pages/index/category/category?val=' + val
    })
  }
})
