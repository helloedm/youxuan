// pages/mine/visitedshops/visitedshops.js
var netWork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    shopdata: [],
    fontNum: 0,
    recommendation: '',
    key:null
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
    this.setData({
      id:options.id,
      key:options.key
    })
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
    this.getData();
    this.getRecommendation();
    this.generateRecommendation();
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
    this.getData();
  },
  // 获取商品详情数据
  getData() {
    let params = {
      id: this.data.id
    }
    netWork.post('goods/goodInfo', params, res => {
      if(res.code === "000"){
        let shopdata = res.data;
        this.setData({
          shopdata:shopdata
        })
      }
    })
  },
  //随机推荐语
  generateRecommendation() {
    netWork.post('/userStoreGoods/randRecommend',{id:1},res => {
      if(res.code === "000"){
        let recommendation = res.data.recommend_des;
        if(this.data.recommendation == ""){
          this.setData({
            recommendation:recommendation,
            fontNum: recommendation.length,
          })
        }
      }
    })
  },
  //获取推荐语
  getRecommendation(){
    let params = {
      goods_id: this.data.id
    }
    netWork.post('userStoreGoods/storeGoodsInfo', params, res => {
      if(res.code === "000"){
        if(res.data != null){
          let recommendation = res.data.recommend_des;
          this.setData({
            recommendation:recommendation,
            fontNum: recommendation.length,
          })
        }
      }
    })
  },
  //计算推荐语字数
  changerecommendtext(e){
    let size = e.detail.cursor;
    let value = e.detail.value;
    if(size > 100){
      const valus = value.substring(0,100);
      this.setData({
        fontNum: 100,
        recommendation: valus
      })
      return;
    }
    this.setData({
      fontNum: size,
      recommendation: value,
    })
  },
  //推荐商品
  recommendationShop(){
    let params = {
      goods_id: this.data.id,
      recommend_des: this.data.recommendation
    }
    if(this.data.recommendation == ''){
      wx.showToast({
        title: '店铺简介不能为空',
        icon: 'none'
      })
      return;
    }
    netWork.post('/userStoreGoods/putGoods', params, res => {
      if(res.code === "000"){
        const shoprecommend = true;
        wx.setStorageSync('shoprecommend',shoprecommend);
        wx.setStorageSync('recommendid', this.data.key);
        wx.switchTab({
          url: '/pages/index/index'
        })

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})