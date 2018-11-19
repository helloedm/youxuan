const netWork=require("../../utils/network.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    /**
     * kind,在那个页面出现
     * 1,商品详情,detail
     * 2,专题页面,list activityId
     * 3,店铺页面,list activityId
     * 4,红包页面,
     * 5,个人主题页面(可能不需要)
     */
    kind:{
      type:String,
      value:""
    },
    detail:{
      type:Object,
      value:{}
    },
    list:{
      type:Array,
      value:[]
    },
    activityId:{
      type:String,
      value:'1'
    },
    title:{
      type:String,
      value:'爱聚优选'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showImgurl:'',
    showImg:false,
    img1:'',
    img2:'',
    img3:'',
    img4:'',
    img5:'',
    img6:'',
    img7:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        show:false
      })
      wx.showTabBar({
        
      })
    },
    draw(){
      wx.showLoading({
        title: '正在生成图片中..',
        mask:true,
        success:()=>{
          setTimeout(()=>{
            wx.hideLoading();
          },10000)
        }
      })
      switch (this.data.kind){
        case "1":
          this.drawDetail();
          break;
        case "2":
          this.drawShipping();
          break;
        case "3":
          this.drawShop();
          break;
        case "4":
          this.drawHongbao();
          break;
        default:
          break;
      }
    },
    /**
     * 商品详情页面生成海报
     */
    drawDetail(){
      let n=0;
      let str = this.data.detail.title;
      let str1 = str.substring(0, 11);
      let str2 = str.substring(11, 20) + '...';
      let v2 = this.data.detail.inner_price - this.data.detail.inner_price * this.data.detail.rebate_percent * 2 / 300;
      let nickname = getApp().globalData.user.nickname ? getApp().globalData.user.nickname : '爱聚优选';
      let proportion = nickname.length + 1;
      if(nickname.length > 9){
        nickname = nickname.substring(0,9) + "...";
        proportion = 10;
      }
      let str3 = v2.toFixed(2);
      let inner_price = this.data.detail.inner_price;
      let outer_price = this.data.detail.outer_price;
      let createImgUrl = (num, sum) => {
        if (num == 6) {
          let context = wx.createCanvasContext("canvas4", this);
          context.setFillStyle('#FFFFFF');
          context.fillRect(0, 0, 750, 1334);
          context.drawImage(this.data.img1, 478, 987, 208, 208);
          // context.drawImage(this.data.img2, 0, 0, 750, 1334);
          context.drawImage(this.data.img3, -75, 0, 900, 900);
          context.drawImage(this.data.img4, 29, 1210, 44, 44);
          // context.drawImage(this.data.img5, 474, 802, 196, 91);
          context.arc(67.5, 137.5, 37.5, 0.5 * Math.PI, 1.5 * Math.PI);
          context.setFillStyle('rgba(0,0,0,0.5)');
          context.fill();
          context.beginPath()
          context.arc(67.5 + 35 * proportion, 137.5, 37.5, 1.5 * Math.PI, 0.5 * Math.PI);
          context.setFillStyle('rgba(0,0,0,0.5)');
          context.fill();
          context.fillRect(67.5, 100, 35 * proportion,75);
          context.save();
          context.beginPath();
          context.arc(67.5, 137.5, 37.5, 0, 2 * Math.PI);
          context.clip();
          context.drawImage(this.data.img6, 30, 100, 75, 75);
          context.restore();
          //姓名
          context.setFillStyle("#FFFFFF");
          context.setFontSize(34);
          context.setTextBaseline("top");
          context.fillText(nickname , 116, 117);
          //商品名称
          context.setFillStyle("#1B2E3E");
          context.setFontSize(36);
          context.setTextBaseline("top");
          context.fillText(str1, 30, 959);
          context.fillText(str2, 30, 1005);
          context.setFillStyle("#E31436");
          context.setFontSize(52);
          // context.setTextAlign('center');
          context.fillText("￥" + inner_price, 30, 1070);
          context.setFillStyle("#95A9C1");
          context.setFontSize(32);
          context.setTextAlign('left');
          context.fillText("￥" + outer_price, 70 + inner_price.length * 30, 1093);
          context.moveTo(70 + inner_price.length * 30, 1115);
          context.lineTo(70 + inner_price.length * 30 + outer_price.length * 22, 1115);
          context.stroke();
          context.setFillStyle("#192C3B");
          context.setFontSize(34);
          context.fillText("爱聚优选",84,1201);
          context.setFontSize(20);
          context.fillText("爱分享 聚生活", 84, 1244);
          context.draw(true, () => {
            this.setData({
              show: false
            })
            this.createPoster("canvas4");
          })
        }
      }
      //分享背景号
      wx.downloadFile({
        url:"https://youxuan.ecbao.cn/goods/1534392087314_41.png",
        success:(res)=>{
          n++;
          this.setData({
            img2:res.tempFilePath
          })
          createImgUrl(n)
        }
      });
      let otherUid = wx.getStorageSync("otherUid");
      // 获取当前页面的小程序二维码
      netWork.post("UserInfo/getQrcode",
        {
          scene: "id=" + this.data.detail.id + "&code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
          url: 'pages/goods/detail/detail'
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
        })
      //商品主图
      wx.downloadFile({
        url: this.data.detail.main_pic,
        success: (res) => {
          n++;
          this.setData({
            img3: res.tempFilePath
          })
          createImgUrl(n);
        }
      })
      //爱聚优选icon
      wx.downloadFile({
        url: "https://youxuan.ecbao.cn/material/1535363838548_43.png",
        success: (res) => {
          n++;
          this.setData({
            img4: res.tempFilePath
          })
          createImgUrl(n);
        }
      });
      //立即抢
      wx.downloadFile({
        url:'https://youxuan.ecbao.cn/goods/1534397143441_89.png',
        success: (res) => {
          n++;
          this.setData({
            img5: res.tempFilePath
          })
          createImgUrl(n);
        }
      })
      //头像
      wx.downloadFile({
        url: getApp().globalData.user.avatar ? getApp().globalData.user.avatar : "https://youxuan.ecbao.cn/svip1.png",
        success: (res) => {
          n++;
          this.setData({
            img6: res.tempFilePath
          })
          createImgUrl(n);
        }
      })
    },
    /**
     * 画红包页面的分享canvas
     */
    drawHongbao(){
      let n=0;
      //生成图片
      let createImgUrl=(num)=>{
        if(num==2){
          let context = wx.createCanvasContext("canvas4",this);
          context.setFillStyle('#FFFFFF');
          context.fillRect(0, 0, 750, 1334);
          context.drawImage(this.data.img1, 280, 1050, 208, 208);
          context.drawImage(this.data.img2, 0, 0, 750, 1334);
          context.draw(true,()=>{
            this.setData({
              show:false
            })
            this.createPoster("canvas4");
          })
        }
      }
      let otherUid = wx.getStorageSync("otherUid");
      // 获取当前页面的小程序二维码
      netWork.post("UserInfo/getQrcode",
        { 
          scene: 'uid=' + getApp().globalData.user.id + '&code=' + getApp().globalData.user.invite_code + "&userid=" + otherUid,
          url:'pages/mine/invitation/invitation'
        },(res)=>{
        if(res.code=="000"){
          wx.downloadFile({
            url: res.data,
            success: (res2) => {
              n++;
              this.setData({
                img1: res2.tempFilePath
              })
              createImgUrl(n, 2);
            }
          })
        }
      })

      wx.downloadFile({
        url:'https://youxuan.ecbao.cn/goods/1534318156733_11.png',
        success:(res)=>{
          n++;
          this.setData({
            img2:res.tempFilePath
          })
          createImgUrl(n);
        }
      })
      
    },
    /**
     * 专题页面画海报
     */
    drawShipping(){
      let n=0;
      let str1 = this.data.list[0].title.substring(0, 5) + '...';
      let str2 = this.data.list[1].title.substring(0, 5) + '...';
      let str3 = this.data.list[2].title.substring(0, 5) + '...';
      let price1 = "¥" + this.data.list[0].inner_price;
      let price2 = "¥" + this.data.list[1].inner_price;
      let price3 = "¥" + this.data.list[2].inner_price;
      let outer_price1 = "¥" + this.data.list[0].outer_price;
      let outer_price2 = "¥" + this.data.list[1].outer_price;
      let outer_price3 = "¥" + this.data.list[2].outer_price;
      let nickname = getApp().globalData.user.nickname ? getApp().globalData.user.nickname : '爱聚优选';
      let createImgUrl=(num)=>{
        console.log(num)
        if(num==7){ 
          let context = wx.createCanvasContext("canvas4", this);
          context.setFillStyle('#FFFFFF');
          context.fillRect(0, 0, 750, 1334);
          context.drawImage(this.data.img1, 478, 987, 208, 208);
          context.drawImage(this.data.img2, 0, 0, 750, 1334);
          context.drawImage(this.data.img3, 82, 583, 176, 176);
          context.drawImage(this.data.img4, 283, 583, 176, 176);
          context.drawImage(this.data.img5, 485, 583, 176, 176);
          context.drawImage(this.data.img6, 322, 314, 102, 102);
          context.save();
          context.beginPath();
          context.arc(90, 150, 40, 0, 2 * Math.PI);
          context.clip();
          context.drawImage(this.data.img7, 50, 110, 80, 80);
          context.restore();
          context.setTextBaseline('top')
          context.setFillStyle("#323331");
          context.setFontSize(34);
          context.fillText(nickname, 150, 135);
          context.setFillStyle("#0B1621");
          context.setFontSize(40);
          context.setTextAlign('center');
          context.fillText(this.data.title, 373, 449, 586);
          context.setFillStyle("#1F2D3D");
          context.setFontSize(28);
          context.setTextAlign('left');
          context.fillText(str1, 81, 782);
          context.fillText(str2, 282, 782);
          context.fillText(str3, 485, 782);
          context.setFillStyle("#E31436");
          context.setFontSize(32);
          context.fillText(price1, 81, 839);
          context.fillText(price2, 282, 839);
          context.fillText(price3, 485, 839);
          context.setFillStyle("#99A9BF");
          context.setFontSize(24);
          context.fillText(outer_price1, 81, 876);
          context.fillText(outer_price2, 282, 876);
          context.fillText(outer_price3, 485, 876);
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(80, 892)
          context.lineTo(170, 892)
          context.stroke()
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(280, 892)
          context.lineTo(370, 892)
          context.stroke()
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(483, 892)
          context.lineTo(573, 892)
          context.stroke()
          context.draw(true,()=>{
            console.log('123')
            this.setData({
              show: false
            })
            this.createPoster("canvas4");
          })
        }
      };
      let otherUid = wx.getStorageSync("otherUid");
      //下载二维码
      netWork.post("UserInfo/getQrcode",
      {
        scene: "id=" + this.data.activityId + "&code=" + getApp().globalData.user.invite_code + "&userid=" + otherUid,
        url:'pages/index/freeShipping/freeShipping'
      },(res)=>{
        if(res.code=="000"){
          wx.downloadFile({
            url:res.data,
            success:(res2)=>{
              n++
              this.setData({
                img1:res2.tempFilePath
              })
              createImgUrl(n)
            }
          })
        }
      });
      //下载背景图
      wx.downloadFile({
        url:'https://youxuan.ecbao.cn/goods/1534392087314_41.png',
        success:(res)=>{
          n++
          this.setData({
            img2:res.tempFilePath
          })
          createImgUrl(n)
        }
      });
      //下载主图
      console.log(this.data.list)
      this.data.list.forEach((el,index)=>{
        wx.downloadFile({
          url: el.main_pic,
          success:(res)=>{
            n++
            let obj={};
            obj["img" + (index + 3)] = res.tempFilePath;
            console.log(obj);
            this.setData(obj);
            createImgUrl(n)
          }
        })
      })
      //下载logo
      wx.downloadFile({
        url:"https://youxuan.ecbao.cn/svip1.png",
        success:(res)=>{
          n++
          this.setData({
            img6:res.tempFilePath
          })
          createImgUrl(n)
        }
      })
      //下载头像
      //头像
      console.log(getApp().globalData.user.avatar);
      wx.downloadFile({
        url: getApp().globalData.user.avatar ? getApp().globalData.user.avatar : "https://youxuan.ecbao.cn/svip1.png",
        success: (res) => {
          n++;
          this.setData({
            img7: res.tempFilePath
          })
          createImgUrl(n);
        }
      })
    },

    /**
     * 画店铺页海报
     */
    drawShop() {
      let n = 0;
      let str1 = this.data.list[0].title.substring(0, 5) + '...';
      let str2 = this.data.list[1].title.substring(0, 5) + '...';
      let str3 = this.data.list[2].title.substring(0, 5) + '...';
      let price1 = "¥" + this.data.list[0].inner_price;
      let price2 = "¥" + this.data.list[1].inner_price;
      let price3 = "¥" + this.data.list[2].inner_price;
      let outer_price1 = "¥" + this.data.list[0].outer_price;
      let outer_price2 = "¥" + this.data.list[1].outer_price;
      let outer_price3 = "¥" + this.data.list[2].outer_price;
      let nickname = getApp().globalData.user.nickname ? getApp().globalData.user.nickname : '爱聚优选';
      let createImgUrl = (num) => {
        console.log(num)
        if (num == 7) {
          let context = wx.createCanvasContext("canvas4", this);
          context.setFillStyle('#FFFFFF');
          context.fillRect(0, 0, 750, 1334);
          context.drawImage(this.data.img1, 478, 987, 208, 208);
          context.drawImage(this.data.img2, 0, 0, 750, 1334);
          context.drawImage(this.data.img3, 82, 583, 176, 176);
          context.drawImage(this.data.img4, 283, 583, 176, 176);
          context.drawImage(this.data.img5, 485, 583, 176, 176);
          context.drawImage(this.data.img6, 322, 314, 102, 102);
          context.save();
          context.beginPath();
          context.arc(90, 150, 40, 0, 2 * Math.PI);
          context.clip();
          context.drawImage(this.data.img7, 50, 110, 80, 80);
          context.restore();
          context.setTextBaseline('top')
          context.setFillStyle("#323331");
          context.setFontSize(34);
          context.fillText(nickname, 150, 135);
          context.setFillStyle("#0B1621");
          context.setFontSize(40);
          context.setTextAlign('center');
          context.fillText(this.data.title, 373, 449, 586);
          context.setFillStyle("#1F2D3D");
          context.setFontSize(28);
          context.setTextAlign('left');
          context.fillText(str1, 81, 782);
          context.fillText(str2, 282, 782);
          context.fillText(str3, 485, 782);
          context.setFillStyle("#E31436");
          context.setFontSize(32);
          context.fillText(price1, 81, 839);
          context.fillText(price2, 282, 839);
          context.fillText(price3, 485, 839);
          context.setFillStyle("#99A9BF");
          context.setFontSize(24);
          context.fillText(outer_price1, 81, 876);
          context.fillText(outer_price2, 282, 876);
          context.fillText(outer_price3, 485, 876);
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(80, 892)
          context.lineTo(170, 892)
          context.stroke()
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(280, 892)
          context.lineTo(370, 892)
          context.stroke()
          context.beginPath()
          context.setLineWidth(0.5)
          context.moveTo(483, 892)
          context.lineTo(573, 892)
          context.stroke()
          context.draw(true, () => {
            console.log('123')
            this.setData({
              show: false
            })
            this.createPoster("canvas4");
          })
        }
      };
      let otherUid = wx.getStorageSync("otherUid");
      //下载二维码
      netWork.post("UserInfo/getQrcode",
        {
          scene: "mid=" + this.data.activityId + "&code=" + getApp().globalData.user.invite_code+ "&userid=" + otherUid,
          url: 'pages/shop/list/list'
        }, (res) => {
          if (res.code == "000") {
            wx.downloadFile({
              url: res.data,
              success: (res2) => {
                n++
                this.setData({
                  img1: res2.tempFilePath
                })
                createImgUrl(n)
              }
            })
          }
        });
      //下载背景图
      wx.downloadFile({
        url: 'https://youxuan.ecbao.cn/goods/1534392087314_41.png',
        success: (res) => {
          n++
          this.setData({
            img2: res.tempFilePath
          })
          createImgUrl(n)
        }
      });
      //下载主图
      this.data.list.forEach((el, index) => {
        wx.downloadFile({
          url: el.main_pic,
          success: (res) => {
            n++
            let obj = {};
            obj["img" + (index + 3)] = res.tempFilePath;
            console.log(obj);
            this.setData(obj);
            createImgUrl(n)
          }
        })
      })
      //下载logo
      wx.downloadFile({
        url: "https://youxuan.ecbao.cn/svip1.png",
        success: (res) => {
          n++
          this.setData({
            img6: res.tempFilePath
          })
          createImgUrl(n)
        }
      })
      //下载头像
      //头像
      wx.downloadFile({
        url: getApp().globalData.user.avatar ? getApp().globalData.user.avatar : "https://youxuan.ecbao.cn/svip1.png",
        success: (res) => {
          n++;
          this.setData({
            img7: res.tempFilePath
          })
          createImgUrl(n);
        }
      })

    },


    //保存图片到本地
    saveImage(url, canvasId) {
      var _this = this;
      console.log(url);
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success(res2) {
          wx.showModal({
            content: '海报已保存到系统相册\n快去分享给朋友',
            showCancel: false,
            confirmText: '我知道了',
            success: function (res2) {

            }
          })
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
                      _this.createPoster(canvasId);
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    /**
     * canvas生成图片
     * 参数canvasId: 需要保存canvas的canvasId
     */
    createPoster: function (canvasId) {
      wx.hideLoading();
      var self = this;
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        fileType: 'jpg',
        quality: '1',
        success: function (res) {
          self.setData({
            showImgurl: res.tempFilePath,
            showImg: true
          })
          self.saveImage(res.tempFilePath, canvasId)
        },
        fail:(res)=>{
          console.log(res);
        }
      },this)
    },
    closeShowImg(){
      this.setData({
        showImg:false
      })
      wx.showTabBar();
    },
    closeBtn(){
      this.setData({
        show:false
      })
      wx.showTabBar();
    }
  }
})
