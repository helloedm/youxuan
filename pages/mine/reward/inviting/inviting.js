// pages/mine/commissionDetail/commissionDetail.js

var netWork = require('../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["结算", "维权"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    date:(()=>{
      let m = new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1): new Date().getMonth();
      let y = new Date().getFullYear();
      return y + "-" + m
    })(),
    page: 1,
    listData: [],
    isShowNoData: false,
    type: null //判断当前是邀请还是收益
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
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
  onShow: function (options) {
    this.getData()
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
  // onShareAppMessage: function () {

  // },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      page: 1,
      listData:[]
    })
    this.getData();
  },
  // 获取结算明细数据
  getData() {
    let url = 'UserInviteReward/banlanceLists';
    let arr = this.data.date.split('-');
    let year = arr[0];
    let month = parseInt(arr[1]);
    console.log(arr)
    let params = {
      page: this.data.page,
      limit: 10,
      year: year,
      month: month,
    }
    netWork.post(url, params, res => {
      if (res.code == "000") {
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
})