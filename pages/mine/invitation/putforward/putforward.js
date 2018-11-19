// pages/cart/cart.js
const app = getApp();
const netWork = require("../../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mymoney:'',
    goods: [],
    likeData: [],
    money_kind:[],//提现门槛
    page: 1,
    isShowRecord:false,
    recordList: [1,2],
    cartItem:null,
    iscan:false,
    amount:'',
    show_success:false,
    selfrecord:[],
    page2:1,
    isShowbottom:false
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (options) {
  //   let shareCon = getApp().globalData.shareCon;
  //   return {
  //     title: shareCon[Math.floor(Math.random() * shareCon.length)],
  //     path: '/pages/mine/invitation/invitation?uid=' + getApp().globalData.user.id,
  //     imageUrl: 'http://youxuan.ecbao.cn/material/1533549404007_56.png'
  //   }
  // },
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
  goonNew() {
    wx.navigateTo({
      url: '/pages/index/freeShipping/freeShipping?id=' + "1"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGusessLike();
    this.getcartList();
    this.getallmoney();
    this.getsingle();
    // this.getselfrecord();
    // this.getselfrecord();
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
    this.getGusessLike();
  },
  // 打开记录
  openRecord() {
    this.setData({
      isShowRecord: true,
      page2:1,
      selfrecord:[]
    })
    this.getselfrecord();
  },
  closeRecord() {
    this.setData({
      isShowRecord: false,
      show_success: false
    })
  },
  /**
   * 获取购买列表
   */
  getcartList() {
    netWork.get("packet/allWithdrawRecord", {}, (res) => {
      if (res.code === "000" && res.data.length > 0) {
        let i = 0;
        setInterval(() => {
          this.setData({
            cartItem: res.data[i]
          })
          i++;
          if (i == res.data.length) {
            i = 0;
          }
          // setTimeout(() => {
          //   this.setData({
          //     cartItem: null
          //   })
          // }, 2000)
        }, 5000)
        this.setData({
          cartItem: res.data
        })
      }
    })
  },
  // 获取猜你喜欢
  getGusessLike() {
    let cate_id = [],
        goods_id = [];
    this.data.goods.forEach(el => {
      cate_id.push(el.cate_id);
      goods_id.push(el.id)
    })
    let params = {
      page: this.data.page,
      limit: 10,
      cate_id: cate_id.join(',') || "",
      goods_id: goods_id.join(',') || "",
    }
    netWork.post('/goods/amazeGoodsList', params, res => {
      if (res.code == "000") {
        this.data.page++
        if (res.data.data.length < res.data.limit && res.data.data.length == 0) {
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
            likeData: [...this.data.likeData, ...res.data.data],
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
  /**
   * 监听下拉事件
   */
  onPullDownRefresh() {
    let otherUid = wx.getStorageSync('otherUid');
    let goods = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    for (let i = 0; i < goods.length; i++) {
      goods.check = false;
    }
    this.setData({
      goods: goods,
      allchoose: false
    })
    this.getGusessLike();
    wx.stopPullDownRefresh();
  },
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  money_click(e){
    let item = e.currentTarget.dataset.item;
    let index=e.currentTarget.dataset.index;
    if (item.right == 1 && Number(this.data.mymoney) >= Number(item.amount)){ 
      //可以提现
      this.setData({
        _num: index,
        iscan : true,
        amount: Number(item.amount)
      })
    } else {
      if (item.right != 1){
        wx.showToast({
          title: '该额度已经提现，请选择其他额度',
          icon: 'none'
        })
        this.setData({
          _num: -1,
          iscan: false
        })
      } else {
        let money = (Number(item.amount) - Number(this.data.mymoney)).toFixed(2);
        wx.showToast({
          title: '还差' + money + '元，继续加油哦',
          icon: 'none'
        })
        this.setData({
          _num: -1,
          iscan: false
        })
      }
    }
  },
  //个人红包余额
  getallmoney(){
    netWork.get('packet/userPacket',{},res=>{
      // console.log(res);
      this.setData({
        mymoney : res.data.amount
      })
    })
  },
  //单个红包
  getsingle() {
    netWork.get('packet/getWithdrawRight', {}, res => {
      // console.log(res);
      this.setData({
        money_kind: res.data
      })
    })
  },
  //提现记录
  // moneyrecord() {
  //   netWork.get('packet/userWithdrawRecord', {}, res => {
  //     // console.log(res);
  //     this.setData({
  //       // money_kind: res.data.data
  //     })
  //   })
  // },
  getmymoney(){
    if (this.data.iscan == true){
      /**
     * 判断是否注册
     */
      if (getApp().globalData.user && !getApp().globalData.user.phone) {
        wx.showModal({
          title: '提醒',
          content: '请先登录，才能申请提现',
          success:(res)=>{
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return
      }
      /**
      * 判断是否绑定邀请码
      */
      if (getApp().globalData.user && getApp().globalData.user.is_code == "0") {
        wx.navigateTo({
          url: '/pages/login/invitation/invitation',
        })
        return
      }
      let params = {
        amount: this.data.amount
      }
      netWork.post('packet/withdraw', params, res => {
        // //清空数据
        // this.setData({
        //   selfrecord: []
        // })
        if (res.code == '000'){
          this.setData({
            show_success:true,
            _num: -1,
            iscan: false
          })
          this.getallmoney();
          this.getsingle();
          // this.getselfrecord();
        } else {
          // this.setData({
          //   show_success: true
          // })
        }
      })
    } else {
      wx.showToast({
        title: '暂时还不满足提现条件哦',
        icon: 'none'
      })
    }
  },
  // 本人提现记录
  getselfrecord(){
    netWork.post("packet/userWithdrawRecord", { page: this.data.page2, limit:10},(res)=>{
      if(res.code=="000"){
        if (res.data.data.length < 10) {
          this.setData({
            isShowbottom: true
          })
        }
        if(res.data.data.length==0){
          return;
        }
        this.setData({
          selfrecord: [...this.data.selfrecord,...res.data.data]
        })
      }
    })
  },
  next(){
    this.setData({
      page2:++this.data.page2
    })
    this.getselfrecord();
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      getApp().saveFormId(formId, 1);
    }
  },
})