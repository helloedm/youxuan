// pages/mine/withdrawRecord/withdrawRecord.js
var netWork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['提现中','提现完成'],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    listData:[
    ],
    page:1,
    isShowNoData:false,
    type:null
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
  onShow: function () {
    this.init()
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
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  // 切换tab烂
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page:1,
      listData:[]
    });
    this.init()
  },
  //获取数据
  init(){
    var params ={
      page:this.data.page,
      limit:10,
      status: this.data.activeIndex
    };
  
    let url = this.data.type == 'reward' ? 'UserInviteReward/withdrawLists' : 'UserProfile/withdrawLists';
    netWork.post(url,params,res=>{
        if(res.code=="000"){
          if (res.data.data.length < res.data.limit && res.data.data.length == 0){
              this.setData({
                isShowNoData:true
              } )
          }else{
            if (this.data.page == 1) {
              this.setData({
                isShowNoData: true
              })
            } else {
              this.setData({
                isShowNoData: false
              })
            }
            this.setData( {
              listData: [...this.data.listData,...res.data.data]
            } )
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
  }
})