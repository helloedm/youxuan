
const config = require("../config.js")

let user = {
  login: function (cb) {
    // 登录
    let _this = this;
    let globalData;
    if (getApp()){
      globalData = getApp().globalData
    }
    let sessionId = wx.getStorageSync("sessionId");
    wx.login({
      success: response => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (response.code) {
              wx.request({
                url: config.host + '/account/quickSpLogin.do',
                method: "POST",
                header: {
                  "lversion": `${config.lversion}`,
                  "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                  code: response.code,
                  sessionId: sessionId
                },
                success: function (res) {
                  let _data = res.data
                  if (_data.code == "0") {
                    globalData.fansId = _data.data.quickSpFansId;
                    if (sessionId !== _data.data.sessionId) {     //不同则更新，后台设置5个小时过期
                      wx.setStorageSync('sessionId', _data.data.sessionId);
                    } 
                    if(cb){
                      cb(_data.data.quickSpFansId)
                    }
                  }
                }
              })
        }
      }
    })
  },
}

module.exports = user