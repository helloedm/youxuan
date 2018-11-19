// pages/mine/share/share.js
const netWork=require("../../../utils/network.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImgurl:"",
    img1:'',
    img2:'',
    isiphoneX: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isiphoneX = app.globalData.iphoneX;
    this.setData({
      isiphoneX:isiphoneX,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.draw();
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
  onShareAppMessage: function () {
    let otherUid = wx.getStorageSync("otherUid");
    return {
      title:'爱聚优选 精选好物特卖平台',
      path: 'pages/index/index?invite_code=' + getApp().globalData.user.invite_code + "&userid=" + otherUid,
      imageUrl: this.data.showImgurl
    }
  },
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.showImgurl,
      success(res2) {
        wx.showModal({
          content: '海报已保存到系统相册\n快去分享给朋友',
          showCancel: false,
          confirmText: '我知道了',
          success: function (res2) {

          },
          fail(res2) {
            console.log(res2);
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权,将无法正常保存图片到本地,点击确定重新获取授权。',
              success: function (res2) {
                if (res2.confirm) {
                  wx.openSetting({
                    success: function (res3) {
                      if (res3.authSetting['scope.writePhotosAlbum']) {
                        _this.saveImage();
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  //生成二维码
  draw(){
    wx.showLoading({
      title: '正在生成海报',
      mask:true,
      success:()=>{
        setTimeout(()=>{
          wx.hideLoading()
        },10000)
      }
    })
    let n=0;
    let createImgUrl = (n)=>{
      if(n==2){
        let context = wx.createCanvasContext("canvas1");
        context.setFillStyle('#FFFFFF');
        context.fillRect(0, 0, 750, 1334);
        context.drawImage(this.data.img1, 477, 964, 185, 185);
        context.drawImage(this.data.img2, 0, 0, 750, 1334);
        //邀请码
        context.setFillStyle("#000000");
        context.setFontSize(24);
        context.setTextAlign('center');
        context.fillText(getApp().globalData.user.invite_code, 567, 1213,228);
        context.draw(true,()=>{
          this.createPoster();
        })
      }
    };
    //获取二维码
    netWork.post("UserInfo/getQrcode",
    {
      scene: "invite_code=" + getApp().globalData.user.invite_code,
      url: 'pages/index/index'
    }, (res) => {
      if (res.code == "000") {
        wx.downloadFile({
          url: res.data,
          success: (res2) => {
            n++;
            this.setData({
              img1: res2.tempFilePath
            })
            createImgUrl(n);
          }
        });
      }
    });
    //分享背景号
    wx.downloadFile({
      url: "https://youxuan.ecbao.cn/goods/1534401258350_88.png",
      success: (res) => {
        n++;
        this.setData({
          img2: res.tempFilePath
        })
        createImgUrl(n)
      }
    });
  },
  createPoster: function () {
    wx.hideLoading()
    var self = this;
    wx.canvasToTempFilePath({
      canvasId: "canvas1",
      fileType: 'jpg',
      quality: '1',
      destWidth: '750',
      destHeight: '1334',
      success: function (res) {
        self.setData({
          showImgurl: res.tempFilePath,
          showImg: true
        })
      },
      fail: (res) => {
        console.log(res);
      }
    }, this)
  },
})