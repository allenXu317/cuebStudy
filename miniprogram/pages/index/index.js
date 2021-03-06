// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenBut:true,
    hiddenImg:true,
    userImage:''
  },

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
  authorize: function () {
    let that = this;
    // 获取用户信息
    wx.getSetting({
     success(res) {
      // console.log("res", res)
      if (res.authSetting['scope.userInfo']) {
       console.log("已授权=====")
       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
       wx.getUserInfo({
        success(res) {
        //  console.log("获取用户信息成功", res)
         that.setData({
          userImage:res.userInfo.avatarUrl,
          hiddenBut:true,
          hiddenImg:false
        });
        that.toHome();
        },
        fail(res) {
         console.log("获取用户信息失败", res)
        }
       })
      } else {
       console.log("未授权=====")
       that.setData({
         hiddenBut:false
       })
      //  that.showSettingToast("请授权")
      }
     },
     
    })
  },
  onGetUserInfo: function(e) {
    // console.log("xopopop");
    // console.log(e.detail.userInfo);
    this.setData({
      userImage:e.detail.userInfo.avatarUrl,
      hiddenBut:true,
      hiddenImg:false
    });
    this.toHome();
  },
  toHome:function() {
    wx.redirectTo({
      url: '/pages/home/home',
      fail(err) {
        console.log(err);
      }
    })
  }
})