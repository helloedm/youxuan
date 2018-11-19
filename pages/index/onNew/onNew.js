// pages/index/onNew/onNew.js
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    lists: [],
    isShowBtn: true,
    nonemore: false,
    requsetd: true
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
    this.getOnNew();
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
    this.getOnNew();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '爱聚优选今日上新',
      path: '/pages/index/index?invite_code=' + getApp().globalData.user.invite_code
    }
  },
  getOnNew(){
    netWork.post("goods/goodsList",{
      page:this.data.page,
      limit:10,
      is_new:1
    },(res)=>{
      if(res.code=="000"){
        if(res.data.total_page<=res.data.page){
          this.setData({
            nonemore:true
          })
        }
        this.setData({
          lists: res.data.data.concat(this.data.lists)
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