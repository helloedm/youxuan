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
    id:1,
    image:'',
    title:''
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
      id: options.id
    })
    /**
     * 接受小程序分享者的邀请码
     */
    let invite_code = "";
    if (options.invite_code || options.code) {
      getApp().globalData.invite_code = options.invite_code || options.code;
    }
    if (getApp().globalData.user) {
      this.getData();
    } else {
      getApp().getUserInfo().then((res) => {
        //获取商品列表
        this.getData();
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
    this.getData();
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: 'pages/index/freeShipping/freeShipping?id=' + this.data.id + "&invite_code" + getApp().globalData.user.invite_code
    }
  },
  // 获取数据
  getData() {
    let params = {
      page: this.data.page,
      limit: 10,
      active_id:this.data.id
    }
    netWork.post('goods/activityGoodsList', params, res => {
      if (res.code == "000") {
        wx.setNavigationBarTitle({
          title: res.data.activity_name
        })
        this.setData({
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
            image:res.data.image,
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
  showShareFn(){
    this.setData({
      showShare:true
    })
  }
})