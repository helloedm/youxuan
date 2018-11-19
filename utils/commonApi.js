/* 全局公用接口 */

let network = require('./network.js')
let config = require('../config.js')

/**
 * 解密授权手机号
 * @param {Object} e - {iv:'', encryptedData:''}
 * @param {Function} success - 授权解密之后的回调函数
 * @param {Function} cancel - 取消授权之后的回调函数
 */
export function getSpFansPhone(e,success,cancel) {
  let getQuickSpFansPhone = (code)=>{
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let globalData = getApp().globalData
      let params = {
        code: code,
        quickSpFansId: globalData.fansId,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      console.log('params', params)
      network.post('/weixin/getQuickSpFansPhone.do', params, (res) => {
        console.log('getSpFansPhone', res)
        if (res.code == 0 && res.data.phone) {
          globalData.phoneNumber = res.data.phone
          globalData.fansId = res.data.id
          console.log('你的手机号是：' + res.data.phone)
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              if (success) {
                setTimeout(() => {
                  success(res.data)
                }, 1500)
              }
            },
          })
        }
      })
    } else {
      wx.showToast({
        title: '您取消了授权',
        icon: 'none',
        duration: 1500,
        success: function () {
          if (cancel) {
            setTimeout(() => {
              cancel()
            }, 1500)
          }
        },
      })
    }
  }
  wx.login({
    success: response => {
      getQuickSpFansPhone(response.code)
    }
  })  
}

/**
 * 收集到的formId上报保存
 */
export function saveFormId(obj,success,fail){
  network.post('/spMsg/saveFormid.do', {
      companyId:getApp().globalData.companyId,
      formid:obj.formId
  }, (res) => {
    console.log('saveFormid', res)
    if(res.code == 0){
     
      if(success){
        success()
      }
    }else{
      if(fail){
        fail()
      }
    }
  })
}

/**
 * 上传图片
 */
export function uploadImage(success,fail){
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
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
        url: 'https://aijuhr.com/hrm/weixin/uploadImg.do',
        filePath: tempFilePaths[0],
        name: 'imageFile',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res2) {    
          wx.hideLoading() 
          let data = JSON.parse(JSON.parse(res2.data).data)
          // console.log('uploadfile', data)
          if (success){
            success(data)
          }
        },
        fail:function(err){
          // console.log(err)
          wx.hideLoading() 
          if(err.errMsg.indexOf('请求超时')>-1){
            wx.showToast({
              icon: 'none',
              title: '上传超时，请重新上传图片',
            })
          }
          if(fail){
            fail()
          }
        }
      })
    }
  })
}