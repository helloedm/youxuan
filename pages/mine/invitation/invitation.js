// pages/mine/invitation/invitation.js
var netWork = require('../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    likeData: [],
    page: 1,
    isShowNoData: false,
    isShowRule:false,
    isShowRecord:false,
    isShowMoney:false,
    isShowHelp: false,
    recordList:[],
    amount:0,
    withdrawd_amount:0,
    amountPacket:0,
    helpPage:1,
    moreHelp:false,
    helpOpen:{
      amount:"0",
      status:"0",
      avatar:''
    },
    shareList:[],
    shareRank:1,
    items:[],
    item1:null,
    item2:null,
    rules:'',
    showNickname:false,
    showShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene){
      let scene = decodeURIComponent(options.scene);
      let arr1 = scene.split("&");
      arr1.forEach((el)=>{
        options[el.split('=')[0]] = el.split('=')[1];
      })
    }
    let shareUid="";
    if(options.uid){
      shareUid = options.uid;
    }
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    if (options.invite_code || options.code) {
      getApp().globalData.invite_code = options.invite_code || options.code;
    }
    this.getRule();
    if (getApp().globalData.user){//已经登录过
      this.getuserPacket();
      this.helpPacketRecord();
      this.shareRankingList();
      this.allWithdrawRecord();
      if (shareUid == getApp().globalData.user.id || shareUid == "") {//打开自己分享的小程序
        this.openMoney();
      } else {
        this.openHelp();
        this.openPacket(shareUid);
      }
    }else{
      getApp().getUserInfo("2").then((res)=>{
        this.getuserPacket();
        this.helpPacketRecord();
        this.shareRankingList();
        this.allWithdrawRecord();
        if (shareUid == res.data.id || shareUid==""){//打开自己分享的小程序
          this.openMoney();
        }else{
          this.openHelp();
          this.openPacket(shareUid);
        }
        if (getApp().globalData.user.nickname) {
          this.setData({
            showNickname: true
          })
        }
      })
    }
    this.getGusessLike();
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
    let otherUid = wx.getStorageSync('otherUid');
    let goods = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    this.setData({
      goods: goods,
    })
    if (getApp().globalData.user){
      this.getuserPacket();
      if (getApp().globalData.user.nickname){
        this.setData({
          showNickname:true
        })
      }
    }
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
    this.getGusessLike()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let otherUid = wx.getStorageSync("otherUid");
    let shareCon = getApp().globalData.shareCon;
    return {
      title: shareCon[Math.floor(Math.random() * shareCon.length)],
      path: '/pages/mine/invitation/invitation?uid=' + getApp().globalData.user.id + "&invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
      imageUrl:'http://youxuan.ecbao.cn/material/1533549404007_56.png'
    }
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
  // 详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + id,
    })
  },
  //打开规则弹框
  openRule(){
    this.setData( {
      isShowRule:true
    } )
  },
  closeRule(){
    this.setData({
      isShowRule: false
    })
  },
  // 打开记录
  openRecord() {
    this.setData({
      isShowRecord: true
    })
  },
  closeRecord() {
    this.setData({
      isShowRecord: false
    })
  },
  // 打开余额
  openMoney() {
    this.setData({
      isShowMoney: true
    })
  },
  closeMoney() {
    this.setData({
      isShowMoney: false
    })
  },
  openHelp(){
    this.setData({
      isShowHelp: true
    })
  },
  closeHelp() {
    this.setData({
      isShowHelp: false
    })
  },
  /**
   * 提现
   */
  getmoney(){
    wx.navigateTo({
      url: '/pages/mine/invitation/putforward/putforward'
    })
  },
  /**
   * 我的余额
   */
  getuserPacket(){
    netWork.get("packet/userPacket",{},(res)=>{
      if(res.code=="000"){
        this.setData({
          amount: res.data.amount,
          withdrawd_amount: res.data.withdrawd_amount,
          share_num: res.data.share_num
        })
      }
    })
  },
  /**
   * 帮开金额
   */
  openPacket(shareUid){
    netWork.post("packet/openPacket", { uid: shareUid},(res)=>{
      if (res.code == "000") {
        this.setData({
          helpOpen: res.data,
          errorMsg: res.msg
        })
      }
    })
  },
  /**
   * 帮开记录
   */
  helpPacketRecord(){
    netWork.post("packet/helpPacketRecord", { page: this.data.helpPage, limit:10},(res)=>{
      if(res.code=="000"){
        if(res.data.data.length<10){
          this.setData({
            moreHelp:true
          })
        }
        this.setData({
          recordList: [...this.data.recordList, ...res.data.data]
        })
      }
    })
  },
  next(){
    if(this.data.moreHelp){
      return
    }
    this.setData({
      helpPage: ++this.data.helpPage
    })
    this.helpPacketRecord();
  },
  /**
   * 帮开排行榜
   */
  shareRankingList(){
    netWork.get("packet/shareRankingList",{},(res)=>{
      if(res.code=="000"){
        this.setData({
          shareList: [...this.data.shareList, ...res.data.list],
          shareRank:res.data.rank
        })
      }
    })
  },
  /**
   * 返回首页
   */
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 提现滚动
   */
  allWithdrawRecord(callback){
    netWork.get("packet/allWithdrawRecord",{},(res)=>{
      if(res.code=="000"&&res.data.length>0){
        this.setData({
          items:res.data
        })
        let i = 0;
        setInterval(() => {
          this.setData({
            item2: this.data.items[i]
          })
          i++;
          if(i>=this.data.items.length){
            i=0;
          }
          setTimeout(() => {
            this.setData({
              item1: this.data.item2,
              item2: null
            })
          }, 4900)
          if (this.data.item1){
            setTimeout(() => {
              this.setData({
                item1: null
              })
            }, 4000)
          }
        }, 5000)
      }
    })
  },
  /**
   * 获取规则
   */
  getRule(){
    netWork.get("packet/config",{},(res)=>{
      if(res.code=="000"){
        this.setData({
          rules: res.data.rules
        })
      }
    })
  },
  /**\
   * 获取用户信息
   */
  getUser(e){
    console.log(e.detail);
    if (e.detail.errMsg == "getUserInfo:ok"){
      netWork.post("userInfo/saveAvatar",{
        avatar: e.detail.userInfo.avatarUrl,
        nickname: e.detail.userInfo.nickName
      },(res)=>{
        if(res.code=="000"){
          this.setData({
            showNickname:true
          })
        }
      })
    }
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      getApp().saveFormId(formId, 1);
    }
    console.log(formId);
  },
  showShareFn(){
    this.setData({
      showShare:true,
      isShowRule: false,
      isShowRecord: false,
      isShowMoney: false,
      isShowHelp: false
    })
  }
})