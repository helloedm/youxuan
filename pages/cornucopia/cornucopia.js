// pages/cornucopia/cornucopia.js
const netWork = require('../../utils/network.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '2',
    num: "",//购物车的数量,
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
    this.getNum();
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
    this.setData({
      page: 1,
      listData: []
    })
    this.getData(() => {
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */

  //获取数据
  getData(callBack) {
    let params = {
      page: this.data.page,
      limit: 10,
      title: ''
    }
    netWork.post('/material/lists', params, res => {
      callBack && callBack();
      if (res.code == "000") {
        res.data.data.forEach( el=>{
          let timeArr = el.create_at.split(' ')
          let date = timeArr[0].split('-')[1] +'-'+ timeArr[0].split('-')[2];
          let time = timeArr[1].split(':')[0] +':'+ timeArr[1].split(':')[1];
          el.create_at = date+"  "+time
        } )
        if (res.data.data.length < res.data.limit && res.data.data.length == 0) {
          this.setData({
            isShowNoData: true
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
          res.data.data.forEach((el, i) => {
              el.imgs = JSON.parse(el.imgs || [])
          })

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
  goGoodDetail(e){
    let id = e.target.dataset.id;
    let src = e.target.dataset.src;
    let item = e.currentTarget.dataset.item;
    let imgs=[];
    item.imgs.forEach((el)=>{
      imgs.push(el.img);
    })
    if(id){
        wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + id })
    }else{
      wx.previewImage({
        current:src,
        urls: imgs,
      })
    }
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
    }else{
      wx.hideTabBarRedDot({
        index: 2,
      })
    }
  },
  copy(e){
    let content = e.target.dataset.content
    wx.setClipboardData({
      data: content,
      success: function (res) {
        // wx.getClipboardData({
        //   success: function (res) {
        //     console.log(res.data) // data
        //   }
        // })
        wx.showToast({
          title: '素材文案已复制，点击商品分享链接',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },


})