//app.js
var netWork=require("./utils/network.js");
App({
  onLaunch: function () {
    let that = this;
    wx.getSystemInfo({//  获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
        if(res.model == 'iPhone X (GSM+CDMA)<iPhone10,3>'){
          that.globalData.iphoneX = true; 
        }
      }
    });
    //获取授权
    wx.login({
      success:(res)=>{
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    user:null,
//     user:{
//  avatar:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIlmlMOZaJvMtJXlgoFWVV8xYcpjHHEudT0zVczOcia6cnJBBh1DGCpopEFhQibuynmX409eiaMP8tbQ/132",
//       nickname:"踏歌行"
//     },
    iphoneX:false,
    invite_code:'',
    shareCon:[
      "免费送你5元红包！可提现！",
      "发红包啦！人人有份，点击领取！",
      "帮我开红包，你也可以免费领哦~",
      "就剩2个红包啦，不快点就没啦！",
      "你有一份红包未领取，3小时候将退回"
    ]

  },
  getUserInfo(source){
    wx.showLoading({
      title: '正在登陆',
      mask:true
    })
    return new Promise((callBack,errord)=>{
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          netWork.post("Passport/login", { code: res.code, source: source ? source:'1'}, (res) => {
            wx.hideLoading()
            if (res.code === "000") {
              wx.setStorageSync('token', res.data.token);
              this.globalData.user = res.data;
              console.log(res.data);
              console.log(this.globalData.user);
              // this.globalData.user.nickname ="小羽";
            } else {
              console.log('登录失败')
            }
            callBack && callBack(res);
          })
        }
      })

    })
  },
  saveFormId(formId,type){
    if(!arguments[1]) type=1;
    console.log(formId,"app");
    netWork.post("formId/index",{type:type,form_id:formId},(res)=>{
      console.log(res);
    })
  }
})