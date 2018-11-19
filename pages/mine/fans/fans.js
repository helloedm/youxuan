// pages/mine/fans/fans.js
var netWork = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    isShowNoData:false,
    page:1,
    superUserCount: 0,
    normalUserCount: 0
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
    this.getData();
    
  
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
  // 获取粉丝数据
  getData(){
    let params = {
      current_page: this.data.page,
      page_size: 10
    }
    netWork.post('/UserFans/lists', params, res => {
      if (res.code == "000") {
        if ( res.data.data.length == 0 ){
            this.setData({
              isShowNoData:true
            })
        } else {
          if(this.data.page==1){
            this.setData({
              isShowNoData: true
            })
          }else{
            this.setData({
              isShowNoData: false
            })
          }
          this.setData({
            listData: [...this.data.listData, ...res.data.data],
            superUserCount: res.data.superUserCount,
            normalUserCount: res.data.normalUserCount,
          })
        }
        this.data.page++
        
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})