// pages/mine/addNewAddress/newAddress.js
const netWork=require('../../../utils/network.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    img:"../../../images/logo.png",
    name:"",
    tel:"",
    address:"",
    tagData:["家","学校","公司"],
    selectIndex:'',
    addressArr:null,
    checked:false,
    is_default:'0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getAddress();
    if(options.id){
      wx.setNavigationBarTitle({
        title: '修改收货地址',
      })
      this.setData({
        id: options.id
      })
      this.getDetail(options.id);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  getName(e){
    this.setData( {
      name: e.detail.value
    } )
  },
  getTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  getAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 选择标签
  selectTag(e){
    this.setData( {
      selectIndex: e.currentTarget.dataset.index
    } )
  },
  add(){
    if (!this.data.address || !this.data.name || !this.data.tel || this.data.addressArr.length!=3){
        wx.showToast({
          title: '请编写完整当前的信息',
          icon: 'none',
          duration: 2000
        });
        return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.tel))){
      wx.showToast({
        title: '手机号码填写有误',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    netWork.post('address/create', { 
      receiver_name: this.data.name, 
      receiver_phone: this.data.tel,
      receiver_state: this.data.addressArr[0],
      receiver_city: this.data.addressArr[1],
      receiver_district: this.data.addressArr[2],
      receiver_address:this.data.address,
      tag: this.data.selectIndex,
      is_default: this.data.is_default
      },(res)=>{
        if(res.code=="000"){
          wx.showToast({
            title: '添加成功',
          });
          wx.navigateBack();
        }
      })

  },
  /**
   * 选择省市区
   */
  bindMultiPickerChange(e){
    this.setData({
      addressArr:e.detail.value
    })
  },
  /**
   * 编辑地址,获取地址详情
   */
  getDetail(id){
    netWork.post('address/info', { receiver_address_id:id},(res)=>{
      if(res.code==="000"){
        let addressArr=[];
        addressArr[0] = res.data.receiver_state;
        addressArr[1] = res.data.receiver_city;
        addressArr[2] = res.data.receiver_district;
        this.setData({
          name: res.data.receiver_name,
          tel: res.data.receiver_phone,
          addressArr: addressArr,
          address: res.data.receiver_address,
          selectIndex: res.data.tag,
          is_default: res.data.is_default
        })
      }
    })
  },
  /**
   * 保存修改的地址
   */
  save(){
    if (!this.data.address || !this.data.name || !this.data.tel || this.data.addressArr.length != 3) {
      wx.showToast({
        title: '请编写完整当前的信息',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.tel))) {
      wx.showToast({
        title: '手机号码填写有误',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    netWork.post('address/edit',{
      receiver_address_id:this.data.id,
      receiver_name: this.data.name,
      receiver_phone: this.data.tel,
      receiver_state: this.data.addressArr[0],
      receiver_city: this.data.addressArr[1],
      receiver_district: this.data.addressArr[2],
      receiver_address: this.data.address,
      tag: this.data.selectIndex,
      is_default: this.data.is_default
    },(res)=>{
      if (res.code == "000") {
        wx.showToast({
          title: '修改成功',
        });
        wx.navigateBack();
      }
    })
  },
  /**
   * 设置默认地址
   */
  switchChange(e){
    this.setData({
      is_default: e.detail.value?'1':'0'
    })
  }
})