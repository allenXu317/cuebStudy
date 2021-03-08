// miniprogram/pages/schedule/schedule.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    weekDays:['周一','周二','周三','周四','周五','周六','周日'],
    monthDays:[],
    weekToDay:[],
    db: {},
    userImg: '',
    addFistIsHidden: true,
    addInputClassIsHidden: '',
    valClassName:'',
    valTeacherName:'',
    valPosition:'',
    valStartTime:'',
    valEndTime:'',
    valWeekTime:'',
    scrollTop:0,
    classMonth:0
  },
  app: getApp(),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用footer组件
    this.setData({
      userImg: this.app.globalData.userInfo.avatarUrl
    });
    //初始化数据库
    this.initDb();
    //渲染页面
    this.isEmpty();
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
  //云数据库:
  //初始化数据库
  initDb: function () {
    this.db = wx.cloud.database().collection('schedules');
  },
  // 判断渲染页面:
  isEmpty: function () {
    let that = this;
    this.db.where({
      _openid: that.app.globalData.userCode2Session.openid
    }).get({
      success: function (res) {
        // 如果该用户没有添加课表，则提示添加第一条记录
        if (res.data.length === 0) {
          that.setData({
            addFistIsHidden: false
          })
        } else {
          that.schedulesClass();
        }
      },
    })
  },
  schedulesClass: function() {
    let that = this;
    let date = new Date();
    // 星期
    let weekDay = date.getDay();
    console.log(weekDay);
    this.today = weekDay;
    // 日期
    let monthDay = date.getDate();
    let days = new Array(7);
    let weekdays = new Array(7);
    for (let i = 0;i <= weekDay;i++) {
      days[i] = monthDay - (weekDay - i) + 1;
      if (i === weekDay - 1) {
        weekdays[i] = "weekToDay";
      } else {
        weekdays[i] = "";
      }
    }
    for (let i = weekDay+1;i <= 6;i++) {
      days[i] = monthDay + (i - weekDay) + 1;
      weekdays[i] = "";
    }
    console.log(weekdays);
    this.setData({
      classMonth:parseInt(date.getMonth()) + 1,
      monthDays:days,
      weekToDay:weekdays
    })
  },
  // 添加课表
  addClass: function () {
    let that = this;
    this.setData({
      addInputClassIsHidden: 'inputClass-show'
    });
    this.clearClass();
  },
  // 初始化添加课程表单:
  clearClass:function () {
    // 内容置空、滑倒顶部
    this.setData({
      valClassName:'',
      valTeacherName:'',
      valPosition:'',
      valStartTime:'',
      valEndTime:'',
      valWeekTime:'',
      scrollTop:0
    })
  },
  // 表单添加课程:
  classSubmmit: function (e) {
    console.log(e);
    let values = e.detail.value;
    console.log(values);
    let that = this;
    values = this.confirmClass(values);
    this.db.add({
      data: {
        className: values.className,
        teacherName: values.teacherName,
        classPosition: values.classPosition,
        startTime: values.startTime,
        endTime: values.endTime,
        weekTime:values.weekTime,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          addInputClassIsHidden:'',
          addFistIsHidden:true
        })
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  // 关闭添加课程表单:
  closeInputClass:function() {
    this.setData({
      addInputClassIsHidden: 'inputClass-form-close'
    });
  },
  // 课程表办单验证:
  confirmClass:function(values) {
    // 验证时间:
    const time = ['08:00','09:00','10:10','11:10','13:30','14:30','15:30','16:30','18:30','19:30','20:30','21:30'];
    // 检查开始时间
    let startTime = parseInt(values.startTime);
    if (startTime < 0 || startTime > 12){
      values.startTime = time[11];
    } else {
      values.startTime = time[startTime-1];
    }
    // 检查结束时间
    let endTime = parseInt(values.endTime);
    if (endTime < 0 || endTime > 12){
      values.endTime = time[11];
    } else {
      values.endTime = time[endTime-1];
    }
    console.log(values);
    return values;
  }

})