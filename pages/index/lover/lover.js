// pages/index/freeShipping/freeShipping.js
var netWork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    isShowNoData: false,
    page: 1,
    id: 1,
    image: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    /**判断当前用户是否登录 */
    if (!getApp().globalData.user){
      getApp().getUserInfo().then(()=>{
        this.getData();
      })
    }
  },
  onShareAppMessage: function (options) {
    let shareCon = [
      '七夕专场，购物还能领红包',
      '浪漫七夕，玫瑰19元包邮'
    ];
    return {
      title: shareCon[Math.floor(Math.random() * shareCon.length)],
      path: '/pages/index/lover/lover?id=19',
      imageUrl: 'http://youxuan.ecbao.cn/material/1533871849290_16.png'
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
  // 获取数据
  getData() {
    let params = {
      page: this.data.page,
      limit: 20,
      active_id: this.data.id
    }
    netWork.post('goods/activityGoodsList', params, res => {
      if (res.code == "000") {
        wx.setNavigationBarTitle({
          title: res.data.activity_name
        })
        if (res.data.data.length == 0) {
          this.setData({
            image: res.data.image,
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
            image: res.data.image,
            page: ++this.data.page
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
  //进入商品详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  check_more() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})