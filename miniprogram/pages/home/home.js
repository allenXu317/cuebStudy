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
    startHour: '--',
    startMin: '--',
    startSec: '--',
    endHour: '--',
    endMin: '--',
    endSec: '--',
    userImg: "",
    nextMin: '',
    nextSec: '',
    nextHour: '',
    nextClassName: '今日无课',
    nextClassTeacher: '今日无课',
    nextClassPosition: '今日无课',
    nextClassStartTime: '--',
    nextClassEndTime: '--'
  },
  that: this,
  app: getApp(),
  date: new Date(),
  // db:{},
  // _db:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDb();
    this.timer();
    this.code2Session();
    this.getNextClass();
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
      });
      // console.log(that.data.startHour);
      if (that.data.startHour === '--') {
        
        that.setData({
          nextClassHour: '00',
          nextClassMin: '00',
          nextClassSecond: '00',
          preClassSecond: '00',
          preClassMin: '00',
          preClassHour: '00',
        });
      } else {
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
      }
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

  //初始化数据库
  initDb: function () {
    this.db = wx.cloud.database().collection('schedules');
    this._db = wx.cloud.database().command;
  },

  // 获取下节课的信息
  getNextClass: function () {
    let that = this;
    let date = new Date();
    let weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    //周日:0，周一:1 ... 
    let weekDaysIndex = date.getDay();
    let currentTime = date.getHours();
    // currentTime = (currentTime < 9) ? '0' + currentTime + ":00" : currentTime + '' + ":00";
    // let flag = false;
    // weekDaysIndex = (weekDaysIndex===0)?7:0;

    this.db.where({
      _openid: that.app.globalData.userCode2Session.openid,
      weekTime: weekDays[weekDaysIndex]
    }).get({
      success: function (res) {
        let minRes = [];
        let min = 9999;
        if (res.data.length != 0) {
          for (let k = 0; k < res.data.length; k++) {
            let time = parseInt(res.data[k].startTime);
            console.log(time, currentTime,parseInt(res.data[k].endTime));
            if (time > currentTime && (time - currentTime) < min) {
              min = time - currentTime;
              minRes = res.data[k];
            } else if (time <= currentTime && currentTime<=parseInt(res.data[k].endTime)) {
              console.log("oooo");
              that.setData({
                startHour: '--',
                startMin: '--',
                endHour: '--',
                endMin: '--',
                endSec: '00',
                startSec: '00',
                nextClassName: '正在上课',
                nextClassName: '正在上课',
                nextClassPosition: '正在上课',
                nextClassTeacher: '正在上课'
              })
            }
          }
          // console.log(minRes);
        }
        if (minRes != []) {
          let startTimeArr = minRes.startTime.split(":");
          let endTimeArr = minRes.endTime.split(":");
          that.setData({
            startHour: startTimeArr[0],
            startMin: startTimeArr[1],
            endHour: endTimeArr[0],
            endMin: endTimeArr[1],
            endSec: '00',
            startSec: '00',
            nextClassName: minRes.startTime,
            nextClassName: minRes.className,
            nextClassPosition: minRes.classPosition,
            nextClassTeacher: minRes.teacherName
          })
        } else {
          console.log("pppoooiii");
          that.setData({
            startHour: '--',
            startMin: '--',
            endHour: '--',
            endMin: '--',
            endSec: '00',
            startSec: '00',
            nextClassName: '今日无课',
            nextClassName: '今日无课',
            nextClassPosition: '今日无课',
            nextClassTeacher: '今日无课'
          })
        }
      },
      fali: function (err) {
        that.setData({
          startHour: '--',
          startMin: '--',
          endHour: '--',
          endMin: '--',
          endSec: '00',
          startSec: '00',
          nextClassName: '今日无课',
          nextClassName: '今日无课',
          nextClassPosition: '今日无课',
          nextClassTeacher: '今日无课'
        })
      }
    });
  }



  // getUserImg() {
  //   this.setData({
  //     userImg:this.app.globalData.userInfo.avatarUrl
  //   })
  // }
})