// pages/index/category/category.js
const netWork=require("../../../utils/network.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:'', 
    page:1,
    listData:[],
    isShowNoData: false,
    image: '',
    id:'',
    title: '',
    ismypage:true,
    classify: [
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094396422_28.png',//食品生鲜
        arr: [],
        val: '1',
        id:'1',
        title: '食品生鲜'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094332021_42.png',//家居生活
        arr: [],
        val: '3',
        id: '3',
        title: '家居生活'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094382576_23.png',//母婴玩具
        arr: [],
        val: '2',
        id:'2',
        title:'母婴玩具'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094368833_21.png',//美妆个护
        arr: [],
        val: '4',
        id:'4',
        title: '美妆个护'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094417822_18.png',//服饰箱包
        arr: [],
        val: '5',
        id:'5',
        title: '服饰箱包'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.val){
      let classify = this.data.classify;
      classify.forEach((ele) =>{
        if(options.val == ele.val){
          this.setData({
            title: options.val,
            val: ele.title
          })
        }
      })
      wx.setNavigationBarTitle({
        title: this.data.val
      })
      this.data.classify.forEach((el)=>{
        if(el.val==this.data.title){
          this.setData({
            image: el.tip,
            id:el.id            
          })
        }
      })
    }
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    let otherUid = wx.getStorageSync("otherUid");
    let uid = app.globalData.user.id;
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
    this.getCateGoodsList();
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
    this.getCateGoodsList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let otherUid = wx.getStorageSync("otherUid");
    return {
      title: this.data.val,
      path: 'pages/index/category/category?val=' + this.data.title + "&invite_code" + getApp().globalData.user.invite_code + "&userid=" + otherUid
    }
  },
  getCateGoodsList() {
    netWork.post("goods/getCateGoodsList", {
      page: this.data.page,
      limit: 10,
      cate_name: this.data.id
    }, res => {
      if (res.code == "000" && res.data.data.length!=0) {
        this.setData({
          listData: [...this.data.listData, ...res.data.data],
          page: ++this.data.page
        })
        if (res.data.data.length < 10){
          this.setData({
            isShowNoData: true
          })
        }
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
  //推荐商品
  goRecommend(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/recommend/recommend?id=' + id,
    })
  },
  showShareFn() {
    this.setData({
      showShare: true
    })
  }
})