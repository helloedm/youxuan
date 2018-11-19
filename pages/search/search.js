// pages/search/search.js
const netWork = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    page:1,
    val: '',
    listData: [],
    isShowNoData: false,
    isShowloading:false,
    image: '',
    id: '',
    title: '',
    classify: [
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094396422_28.png',//食品生鲜
        arr: [],
        val: '1',
        id: '1',
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
        id: '2',
        title: '母婴玩具'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094368833_21.png',//美妆个护
        arr: [],
        val: '4',
        id: '4',
        title: '美妆个护'
      },
      {
        tip: 'https://youxuan.ecbao.cn/goods/1535094417822_18.png',//服饰箱包
        arr: [],
        val: '5',
        id: '5',
        title: '服饰箱包'
      }
    ],
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
    this.getgoodslist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  gettitle(e){
    console.log(e);
    this.setData({
      'title': e.detail.value
    })
  },
  init(){
    this.setData({
      isShowNoData: false,
      isShowloading: false,
      listData: [],
      page: 1
    })
  },
  search(){
    this.init();
    this.getgoodslist();
  },
  searchclick(e){
    this.init();
    this.setData({
      'title': e.detail.value
    })
    this.getgoodslist();
  },
  getgoodslist() {
    this.setData({
      isShowloading: true,
    })
    netWork.post("goods/goodsList", {
      page: this.data.page,
      limit: 10,
      title: this.data.title
    }, res => {
      if (res.code == "000" && res.data.data.length != 0) {
        this.setData({
          listData: [...this.data.listData, ...res.data.data],
          page: ++this.data.page
        })
        if (res.data.data.length < 10) {
          this.setData({
            isShowNoData: true,
            isShowloading:false
          })
        }
      } else {
        this.setData({
          isShowNoData: true,
          isShowloading: false
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
  showShareFn() {
    this.setData({
      showShare: true
    })
  }
})