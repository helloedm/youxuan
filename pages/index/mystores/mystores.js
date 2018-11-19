// pages/mine/myStores/myStores.js
var netWork = require('../../../utils/network.js');
var commonApi = require('../../../utils/commonApi.js')
let config = require("../../../config.js")
const app=getApp();
let globalData=getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    background_img:'',
    des: '',
    name: '',
    namefontNum: 0,
    introductionNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyselfShopInfo();
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
  //获取个人店铺信息
  getMyselfShopInfo(){
    let param = {
      uid: globalData.user.id
    }
    netWork.post('/userStore/storeInfo',param,res => {
      if(res.code === "000"){
        let myselfinfo = res.data.data;
        let namefontNum = myselfinfo.name.length;
        let introductionNum = myselfinfo.des.length;
        this.setData({
          img: myselfinfo.img,
          background_img: myselfinfo.background_img,
          des: myselfinfo.des,
          name: myselfinfo.name,
          namefontNum: namefontNum,
          introductionNum: introductionNum
        })
      }
    })
  },
  //编辑个人店铺信息
  editMyselfShopInfo() {
    let params = {
      name: this.data.name,
      img: this.data.img,
      background_img: this.data.background_img,
      des: this.data.des,
    }
    if(this.data.name == ''){
      wx.showToast({
        title: '店铺名称不能为空',
        icon: 'none'
      })
      return;
    }
    if(this.data.des == ''){
      wx.showToast({
        title: '店铺简介不能为空',
        icon: 'none'
      })
      return;
    }
    netWork.post('/userStore/storeEdit', params, res => {
      if(res.code==="000"){
        var pages =getCurrentPages();
        if(pages.length > 1){
          var beforePage = pages[0];
          beforePage.getMyselfShopInfo();
        }
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },
  //店铺名称
  changenametext(e){
    let size = e.detail.cursor;
    let value = e.detail.value;
    if(size > 16){
      const valus = value.substring(0,16);
      this.setData({
        namefontNum: 16,
        name: valus
      })
      return;
    }
    this.setData({
      namefontNum: size,
      name: value
    })
  },
  //店铺简介
  changeintroductiontext(e){
    let size = e.detail.cursor;
    let value = e.detail.value;
    if(size > 30){
      const valus = value.substring(0,30);
      this.setData({
        introductionNum: 30,
        des: valus
      })
      return;
    }
    this.setData({
      introductionNum: size,
      des: value
    })
  },
  //上传图片
  changechooseImg(e){
    const that = this;
    const imgid = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res){
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var tempFiles = res.tempFiles
        if (tempFiles[0].size > 2 * 1024 * 1024) {
          wx.showToast({
            icon: 'none',
            title: '图片大小不能超过2M',
          })
          return false;
        }
        wx.showLoading({
          title: '图片正在上传',
        })
        //上传
        wx.uploadFile({
          url: `${config.host}userStoreGoods/uploadImg`,
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (resa) {    
            wx.hideLoading();
            let data = JSON.parse(resa.data);
            if(imgid == 1){
              that.setData({
                background_img: data.data
              })
            }else{
              that.setData({
                img: data.data
              })
            }
          },
          fail:function(err){
            wx.hideLoading() 
            if(err.errMsg.indexOf('请求超时')>-1){
              wx.showToast({
                icon: 'none',
                title: '上传超时，请重新上传图片',
              })
            }
          }
        })
      }
    })
  }
})