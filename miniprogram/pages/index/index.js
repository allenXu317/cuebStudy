// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenBut: true,
    hiddenImg: true,
    userImage: '',
    imgClass: 'userImage',
    butHidden:'login'
  },
  app:getApp(),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.authorize();
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
  onShareAppMessage: function () {

  },
  // 判断是否授权
  authorize: function () {
    let that = this;
    // 获取用户是否登录
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        // console.log("login success");
        console.log(that.app.userID);
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        //重新登录
        console.log("login fail");
        wx.login({
          success(res) {
            if(res.code) {
              that.app.userID = res;
              console.log("登录成功 ",res);
            }
          },
          fail(err){
            console.log("登陆失败 ",err);
          }
        }) 
      }
    })
    // 获取用户信息
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.app.globalData.userInfo = res.userInfo;
              //  console.log("获取用户信息成功", res)
              that.setData({
                userImage: res.userInfo.avatarUrl,
                imgClass: 'userImage-look',
                butHidden:'butHidden'
              });
              that.toHome();
            },
            fail(res) {
              that.app.globalData.userInfo = {};
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.app.globalData.userInfo = {};
          that.setData({
            hiddenBut: false
          })
        }
      },
    })
  },
  // 登录按钮的回调函数
  onGetUserInfo: function (e) {
    // console.log(e.detail.userInfo);
    this.app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userImage: e.detail.userInfo.avatarUrl,
      imgClass: 'userImage-look',
      butHidden:'butHidden'
    });
    this.toHome();
  },
  // 跳转至首页
  toHome: function () {
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/home/home',
        fail(err) {
          console.log(err);
        }
      })
    }, 2000)
  }
})