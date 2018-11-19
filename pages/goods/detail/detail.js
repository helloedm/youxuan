// pages/goods/detail/detail.js
const netWork =require("../../../utils/network.js");
const WxParse=require('../../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    imgUrls: [],
    count: (23 - new Date().getHours()) + '时' + (59 - new Date().getMinutes()) + '分' + (60 - new Date().getSeconds()) + '秒',
    tabs:['商品详情','商品参数'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    ismypage:true,
    specificationShow:false,
    id:null,
    detail:{
      status:"3"
    },
    isiphoneX:false,
    skuObj:null,
    goods_sku_title:'',
    addNum:1,
    description:'',
    s:0,
    m:0,
    h:0,
    disabledArr:[],//需要禁用的选项，
    canvasHidden:false,
    shareImg:'',
    onePic:"",
    threePic:"",
    isShowShare:false,
    assuranceShow:false,
    showShare:false,
    issuper:false,
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
    //接受小程序分享者的店铺id
    if(options.userid !== undefined){
      const uid = options.userid;
      wx.setStorageSync('otherUid', uid);
    }
    // 商品热卖倒计时
    setInterval(()=>{
      if (this.data.special_end_time){
        let result = this.data.special_end_time*1000-new Date().getTime();
        this.setData({
          h: new Date(result).getHours(),
          m: new Date(result).getMinutes(),
          s: new Date(result).getSeconds()
        })
      }else{
        this.setData({
          h: 23 - new Date().getHours(),
          m: 59 - new Date().getMinutes(),
          s: 60 - new Date().getSeconds()
        })
      }
    },1000)
    wx.downloadFile({
      // url: 'https://youxuan.ecbao.cn/default/1532068498018_29.png',//优惠券
      url: 'https://youxuan.ecbao.cn/material/1533051014212_44.png',//优惠券
      success: (res)=> {
        this.setData({
          threePic: res.tempFilePath
        })
      },
      complete: () => {
      }
    });
    /**
     * 接受小程序分享者的邀请码
     */
    let isiphoneX = app.globalData.iphoneX;
    this.setData({
      isiphoneX:isiphoneX,
    })
    let invite_code = "";
    if (options.invite_code || options.code) {
      invite_code = options.invite_code || options.code;
      getApp().globalData.invite_code = invite_code;
    }
    if (getApp().globalData.user) {
      this.getGoodDetail();
      this.setData({
        issuper: getApp().globalData.user.rank == '1'? false : true
      })
      console.log(this.data.issuper)
    } else {
      getApp().getUserInfo().then((res) => {
        //获取商品列表
        this.getGoodDetail();
        this.setData({
          issuper: getApp().globalData.user.rank == '1' ? false : true
        })
        console.log(this.data.issuper)
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
    // this.getGoodDetail();
    // 创建 canvas
  },
  // 画图
  drawPic(){
    let str = this.data.detail.title
    let str1 = str.substring(0, 16);
    let str2 = str.substring(16, 25) + '...';
    let price = this.data.detail.inner_price
    var ctx = wx.createCanvasContext('share')
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 400, 320);
    ctx.drawImage(this.data.onePic, 10, 10, 160, 160)
    ctx.setFontSize(18)
    ctx.setFillStyle('black')
    ctx.fillText(str1, 175, 25)
    ctx.fillText(str2, 175, 50)
    ctx.setFillStyle('red')
    ctx.fillText('￥' + price, 175, 90)
    // ctx.drawImage(this.data.twoPic, , 70, 70, 20)
    ctx.setStrokeStyle('#CCAD6E')
    ctx.strokeRect(270, 75, 72, 20)
    ctx.setFillStyle('#CCAD6E')
    ctx.setFontSize(14)
    ctx.fillText('买贵就赔', 278,90)
    ctx.drawImage(this.data.threePic, 10, 190, 400, 110)
    ctx.draw(true,()=>{
      this.downLoadPic();
    });
    
      
  },

  // 下载画完的图片
  downLoadPic(){
    var that =this;
    wx.canvasToTempFilePath({
      fileType: 'jpg',
      quality: '1',
      canvasId: 'share',
      success: function (res) {
        that.setData( {
          shareImg: res.tempFilePath,
          isShowShare:true
        } )

      },
      fail(error){
        console.log(error)
      }
    })
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
  onShareAppMessage: function (res) {
    let otherUid = wx.getStorageSync("otherUid");
    return {
      title: '爱聚优选  精选好物特卖平台',
      path: "pages/goods/detail/detail?id=" + this.data.id + "&invite_code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
      imageUrl: this.data.shareImg
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  showSpecification(){
    this.setData({
      specificationShow:true
    })
  },
  cancelSpecification(){
    this.setData({
      specificationShow: false
    })
  },
  //获取当前商品详情
  getGoodDetail(){
    var that=this;
    this.data.description =""
    let uid = app.globalData.user.id;
    let otherUid = wx.getStorageSync('otherUid');
    if(uid == otherUid){
      this.setData({
        ismypage:false,
      })
    }
    netWork.post('goods/goodInfo', {id:this.data.id},(res)=>{
      if(res.code==="000"){
        let imgUrls=res.data.pics.split(',');
        let detail=res.data;
        let attr=detail.attr;
        let disabledArr=[];
        let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
        detail.num = 0;
        detail.attr_name_id=[];
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id == detail.id && cart[i].sku_id == detail.sku_id) {
            detail.num = cart[i].num;
          }
        }
        WxParse.wxParse('description', 'html', detail.description, that)
        this.setData({
          detail: detail,
          // description: WxParse.wxParse('description', 'html', detail.description, that),
          imgUrls: imgUrls
        })
        attr.forEach((a, i) => {
          disabledArr[i] = this.filterAttrs(detail.attr_name_id);
        })
        this.setData({
          disabledArr: disabledArr
        })
        // 主图
        // res.data.main_pic
        wx.downloadFile({
          url: res.data.main_pic,
          success: (res)=> {
            this.setData({
              onePic: res.tempFilePath
            })
          },
          complete: () => {
            this.drawPic()
          }
        })
       
      }
    })
  },
  //选择规格
  chooseSku(e){
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let disabledArr = this.data.disabledArr;
    let detail=this.data.detail;
    let attr=detail.attr;
    let sku=detail.sku;
    let skuObj=null;
    let threeActive=true;
    if (detail.attr_name_id[index] == item.attr_name_id){
      detail.attr_name_id[index]=0;
    }else{
      detail.attr_name_id[index] = item.attr_name_id;
    }

    attr.forEach((a,i)=>{
      if (detail.attr_name_id[i]){
        disabledArr[i] = this.filterAttrs(this.del_array_val(detail.attr_name_id, detail.attr_name_id[i]));
      }else{
        disabledArr[i] = this.filterAttrs(detail.attr_name_id);
      }
    })
    detail.attr_name_id.forEach((el,i)=>{
      if (!el || i == detail.attr_name_id.length-1){
        threeActive=false;
      }
    })
    console.log(threeActive);
    if (!threeActive){
      for(let i=0;i<sku.length;i++){
        let el=sku[i];
        let arr = JSON.parse(JSON.stringify(detail.attr_name_id));
        if (arr.sort((a, b) => { return a - b }).join() == el.attr_ids){
          detail.sku_id = el.sku_id;
          detail.inner_price = el.inner_price;
          detail.stock_num = el.stock_num;
          detail.attr_names = el.attr_names;
          skuObj=el;
          break
        }
      }
    }

    this.setData({
      disabledArr: disabledArr,
      detail:detail,
      skuObj:skuObj,
      addNum:1,
      goods_sku_title: detail.attr_names ? detail.attr_names : ''
    })
  },
  //
  openSku(){
    this.setData({
      specificationShow: true
    })
  },
  //返回首页, 不会返回
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //去往购物车, 可以返回
  goCart(){
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  //加入购物车
  addCart(e){
    let type = e.currentTarget.dataset.type;
    let skuObj = this.data.skuObj;
    let good = this.data.detail;
    if (good.status!="3"){
      wx.showToast({
        title: '商品已经下架',
        icon:'none'
      })
      return
    }
    /**
     * 判断是否注册
     */
    if (getApp().globalData.user && !getApp().globalData.user.phone) {
      wx.switchTab({
        url: '/pages/mine/mine',
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
    if (good.attr.length == good.attr_name_id.length || good.sku_type == 1){//已经选择规格或者
      good.num = this.data.addNum;
    }else{
      if(type==2){
        wx.showToast({
          title: '请选择规格!',
          icon:'none'
        })
        return
      }else{
        this.openSku();
        return
      }
    }
    this.setData({
      detail:good,
      addNum:1
    })

    this._addCart(good);
    this.cancelSpecification();
  },

  //添加到购物车
  _addCart(good) {
    let otherUid = wx.getStorageSync('otherUid');
    console.log(otherUid);
    let cart = wx.getStorageSync("cart"+otherUid) ? JSON.parse(wx.getStorageSync("cart"+otherUid)) : [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id == good.id && cart[i].sku_id == good.sku_id) {
        cart[i].num += good.num;
        wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
        wx.showToast({
          title: '添加成功'
        })
        return
      }
    }
    console.log(cart);
    cart.push(good);
    wx.setStorageSync("cart"+otherUid, JSON.stringify(cart));
    wx.showToast({
      title: '添加成功'
    })
  },
  //修改规格的数量
  addCartNum(e){
    let num = e.currentTarget.dataset.num;
    if (this.data.addNum <=1 && num=="-1"){
      return
    }
    num+=this.data.addNum;
    this.setData({
      addNum:num
    })
  },
  /**
   * 立即购买
   */
  immediately(e){
    let type = e.currentTarget.dataset.type;
    let items=[];
    let good = this.data.detail;
    if (good.status != "3") {
      wx.showToast({
        title: '商品已经下架',
        icon: 'none'
      })
      return
    }
     /**
     * 判断是否注册
     */
    if (getApp().globalData.user && !getApp().globalData.user.phone) {
      wx.switchTab({
        url: '/pages/mine/mine',
      })
      return
    }
    /**
    * 判断是否绑定邀请码
    */
    if (getApp().globalData.user && getApp().globalData.user.is_code=="0") {
      wx.navigateTo({
        url: '/pages/login/invitation/invitation',
      })
      return
    }
    if (good.attr.length == good.attr_name_id.length || good.sku_type == 1){
      let item = {};
      if (!this.data.addNum) {
        wx.showToast({
          title: '请选择商品规格数量',
          icon: 'none'
        })
        return
      }
      item.goods_id = this.data.detail.id;
      item.sku_id = this.data.detail.sku_id;
      // item.sku_id = good.sku_type == 1 ? this.data.detail.sku[0].sku_id : this.data.detail.sku_id;
      item.quantity = this.data.addNum;
      // item.
      items.push(item);
      wx.setStorageSync("orders", items);
      wx.navigateTo({
        url: '/pages/order/order'
      })
    }else{
      if(type==2){
        let item={};
        if (!this.data.detail.sku_id || !this.data.addNum){
          wx.showToast({
            title: '请选择商品规格数量',
            icon:'none'
          })
          return
        }
        item.goods_id = this.data.detail.id;
        item.sku_id = this.data.detail.sku_id;
        item.quantity = this.data.addNum;
        items.push(item);
        wx.setStorageSync("orders", items);
        wx.navigateTo({
          url: '/pages/order/order'
        })
      }else{
        this.openSku();
      }
    }
  },
  /**
   * 前往店铺
   */
  goShop(){
    wx.navigateTo({
      url: '/pages/shop/list/list?mid=' + this.data.detail.mid,
    })
  },
  /**
   * 选择规格
   */
  filterAttrs(ids){
    let products = [], result=[];
    let sku_list=this.data.detail.sku;
    let _attr = '', _all_ids_in;
    sku_list.forEach(function (v,k1) {
      _attr = ',' + v['attr_ids'] + ',';
      _all_ids_in = true;
      for (let k=0;k<ids.length;k++) {
        if (ids[k] && _attr.indexOf(',' + ids[k] + ',') == -1) {
          _all_ids_in = false;
          break;
        }
      }
      if (_all_ids_in) {
        products.push(v);
      }
    });
    products.forEach(function (v,k) {
      result = result.concat(v['attr_ids'].split(','));
    });
    return result;
  },
  /**
   * 删除数组arr中的val,返回一个新的数组
   */
  del_array_val(arr, val) {
    //去除 数组 arr中的 val ，返回一个新数组
    var a = [];
    for(var k=0;k<arr.length;k++) {
      if (arr[k] != val) {
        a.push(arr[k]);
      }
    }
    return a;
  },
  /**
   * 获取formId
   */
  getFromId(e) {
    let formId = e.detail.formId;
    if (formId != "the formId is a mock one") {
      app.saveFormId(formId, 1);
    }
    console.log(formId);
  },
  /**
   * 展示服务保障列表
   */
  assurance(){
    this.setData({
      assuranceShow:true
    })
  },
  // 推荐商品
  goRecommend(){
    wx.navigateTo({
      url: '/pages/goods/recommend/recommend?id=' + this.data.id,
    })
  },
  /**
   * 展示分享选择框
   */
  showShareFn(){
    this.setData({
      showShare:true
    })
  },
  // 会员1元购买
  jumptobuy(){
    wx.navigateTo({
      url: '/pages/vip/month/month',
    })
  }
})