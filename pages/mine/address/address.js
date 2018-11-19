// pages/mine/address/address.js
const netWork=require("../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    selectIndex:-1,
    from:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.from){
      this.setData({
        from:options.from
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
    this.getList();
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
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  radioChange: function (e) {
    console.log(e.detail.value)
    var items = this.data.items;
    let address=null;
    items.forEach( (el)=>{
      el.checked =false;
      if (el.id == e.detail.value){
          el.checked =true;
          address=el;
      }
    } )
    this.setData( {
      items: items
    } )
    if(this.data.from=="order"){
      wx.navigateBack();
      wx.setStorageSync("address", address);
    }
  },
  // 编译地址
  editAddress(e){
  var id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: "../addNewAddress/newAddress?id="+id,
  })
  },
  //新增收货地址
  addNewAddress(){
    wx.navigateTo( {
      url: "../addNewAddress/newAddress",
    } )
  },
  /**
   * 获取地址列表
   */
  getList(){
    netWork.get('address/index',{},(res)=>{
      if(res.code==="000"){
        this.setData({
          items:res.data
        })
      }
    })
  },
  /**
   * 删除地址
   */
  removeAddress(e){
    let id = e.currentTarget.dataset.id;
    netWork.post('address/del',{
      receiver_address_id:id
    },(res)=>{
      this.getList();
    })
  },
  /**
   * 设置默认
   */
  setDefault(e){
    let id=e.currentTarget.dataset.id;
    netWork.post('address/set_default',{
      receiver_address_id:id,
      is_default:1
    },(res)=>{
      this.getList();
    })
  },
  /**
   * 获取微信收货地址
   */
  chooseAddress(){
    wx.chooseAddress({
      success:(res)=>{
        netWork.post('address/create', {
          receiver_name: res.userName,
          receiver_phone: res.telNumber,
          receiver_state: res.provinceName,
          receiver_city: res.cityName,
          receiver_district: res.countyName,
          receiver_address: res.detailInfo,
          is_default: 0,
          tag:''
        }, (res) => {
          if (res.code == "000") {
            wx.showToast({
              title: '选择成功',
            });
            this.getList();
          }
        })
      }
    })
  }
  

})