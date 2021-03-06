// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "搜索内容",
    iconHidden: false,
    searchClass: 'search',
    nextClassHour: '00',
    nextClassMin: '00',
    nextClassSecond: '00',
    startHour: '23',
    startMin: '00',
    startSec: '00',
    endHour: '22',
    endMin: '00',
    endSec: '00'
  },
  that: this,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  // 点击搜索框效果
  onFocus: function () {
    this.setData({
      value: "",
      iconHidden: true,
      searchClass: 'search-focus',
    });
  },
  onBlur: function () {
    this.setData({
      value: "搜索内容",
      iconHidden: false,
      searchClass: ''
    });
  },
  timer: function () {
    let that = this;
    setInterval(function () {
      console.log(wx.getUserInfo({
        success: function(res) {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          console.log(nickName);
        }
      }));
      // let that = that;
      let date = new Date();
      let nowHour = date.getHours();
      // console.log(nowHour);
      let nowMin = date.getMinutes();
      let nowSec = date.getSeconds();
      let sum = nowHour * 60 * 60 + nowMin * 60 + nowSec;
      // console.log(typeof(that.data.startHour),that.data.startHour);
      let startTime = that.timeStrToTimeNum(that.data.startHour) * 60 * 60 + that.timeStrToTimeNum(that.data.startMin) * 60 + that.timeStrToTimeNum(that.data.startSec);
      // console.log(sum, startTime);
      let hour = (startTime - sum) / 60 / 60;
      let min = (startTime - sum) / 60 % 60;
      let sec = (startTime - sum) % 60;
      // console.log(hour, min, sec);
      that.setData({
        nextClassHour: parseInt(hour),
        nextClassMin: parseInt(min),
        nextClassSecond: parseInt(sec)
      });
    }, 1000);
  },
  timeStrToTimeNum: function (time) {
    if (time.indexOf('0') === 0) {
      return parseInt(Number(time.split('')[1]));
    } else {
      return parseInt(Number(time));
    }
    
  },
})