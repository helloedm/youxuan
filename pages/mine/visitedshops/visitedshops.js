// pages/mine/visitedshops/visitedshops.js
var netWork = require('../../../utils/network.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    isShowNoData: false,
    page: 1,
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
  //去别人店铺
  goOtherStore(e){
    let id = e.currentTarget.dataset.id;
    wx.setStorageSync('otherUid', id);
    wx.setStorageSync('storeId', id);
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 获取访问店铺数据
  getData() {
    let params = {
      limit: 10,
      page: this.data.page,
    }
    netWork.post('/userStore/historyStoreList', params, res => {
      if (res.code == "000") {
        console.log(res);
        if (res.data.data.length == 0) {
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
            listData: [...this.data.listData, ...res.data.data],
          })
        }
        this.data.page++

      } else {
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