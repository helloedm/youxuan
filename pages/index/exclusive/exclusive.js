// pages/index/exclusive/exclusive.js
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    lists:[],
    nonemore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 接受小程序分享者的邀请码
     */
    let invite_code = "";
    if (options.invite_code || options.code) {
      invite_code = options.invite_code || options.code;
      getApp().globalData.invite_code = invite_code;
    }
    if (getApp().globalData.user){
      this.getLists();
    }else{
      getApp().getUserInfo().then((res) => {
        //获取商品列表
        this.getLists();
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
    this.getLists();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '爱聚优选新人专享',
      path: '/pages/index/exclusive/exclusive?invite_code=' + getApp().globalData.user.invite_code
    }
  },
  getLists(){
    netWork.post("goods/goodsList",{
      page:this.data.page,
      limit:10,
      new_enjoy:1
    },res=>{
      if(res.code==="000"){
        if (res.data.total_page <= res.data.page) {
          this.setData({
            nonemore: true
          })
        }
        this.setData({
          lists: this.data.lists.concat(res.data.data)
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
})