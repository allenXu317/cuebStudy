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
    preClassSecond: '00',
    preClassHour: '00',
    preClassMin: '00',
    startHour: '23',
    startMin: '00',
    startSec: '00',
    endHour: '22',
    endMin: '00',
    endSec: '00',
    userImg: "",
    nextMin: '',
    nextSec: '',
    nextHour: '',
  },
  that: this,
  app: getApp(),
  date: new Date(),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer();
    this.code2Session();
    // 使用footer组件
    this.setData({
      userImg: this.app.globalData.userInfo.avatarUrl,
      // nextSec:'nextSec'
    })
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
      // console.log(that.app.globalData.userInfo);
      // let that = that;
      that.setData({
        nextSec: '',
        nextMin: '',
        nextHour: '',
      })
      let date = new Date();
      let nowHour = date.getHours();
      // console.log(nowHour);
      let nowMin = date.getMinutes();
      let nowSec = date.getSeconds();
      let sum = nowHour * 60 * 60 + nowMin * 60 + nowSec;
      // console.log(typeof(that.data.startHour),that.data.startHour);
      let startTime = that.timeStrToTimeNum(that.data.startHour) * 60 * 60 + that.timeStrToTimeNum(that.data.startMin) * 60 + that.timeStrToTimeNum(that.data.startSec);
      // console.log(sum, startTime);
      let hour = parseInt((startTime - sum) / 60 / 60);
      let min = parseInt((startTime - sum) / 60 % 60);
      let sec = parseInt((startTime - sum) % 60);
      // console.log(hour, min, sec);
      let nextMin = '';
      let nextHour = '';
      // sec = (sec<10)?'0'+sec:sec+'';
      min = (min < 10) ? '0' + min : min + '';
      hour = (hour < 10) ? '0' + hour : hour + '';
      // console.log(parseInt(min),that.data.nextClassMin);
      that.setData({
        nextClassHour: hour,
        nextClassMin: min,
        nextClassSecond: (sec < 10) ? '0' + sec : sec + '',
        nextSec: 'next',
        nextMin: (min !== that.data.nextClassMin) ? 'next' : '',
        nextHour: (hour !== that.data.nextClassHour) ? 'next' : '',
        preClassSecond: that.data.nextClassSecond,
        preClassMin: that.data.nextClassMin,
        preClassHour: that.data.nextClassHour,
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
  code2Session: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log('callFunction test result: ', res)
        that.app.globalData.userCode2Session = res;
      }
    })
  },
  // getUserImg() {
  //   this.setData({
  //     userImg:this.app.globalData.userInfo.avatarUrl
  //   })
  // }
})