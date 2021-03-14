// miniprogram/pages/schedule/schedule.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    contentClass: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    classColors: [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '']
    ],
    classContents: [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '']
    ],
    monthDays: [],
    weekToDay: [],
    db: {},
    _db:{},
    userImg: '',
    addFistIsHidden: true,
    addInputClassIsHidden: '',
    valClassName: '',
    valTeacherName: '',
    valPosition: '',
    valStartTime: '',
    valEndTime: '',
    valWeekTime: '',
    scrollTop: 0,
    classMonth: 0,
    classInfoName: '',
    classInfoTeacher: '',
    classInfoPosition: '',
    classInfoTime: '',
    classInfoHidden: true,
    classInfoShow: '',
    schedulesHidden:true
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
    this._db = wx.cloud.database().command;
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
            addFistIsHidden: false,
            schedulesHidden: true
          })
        } else {
          that.schedulesClass();
          that.showClass(res);
        }
      },
    })
  },
  // 表头初始化
  schedulesClass: function () {
    let that = this;
    let date = new Date();
    // 星期
    // js设定周日的索引为0
    let weekDay = date.getDay();
    weekDay = (weekDay === 0)?weekDay+7:weekDay;
    // console.log(weekDay);
    this.today = weekDay;
    // 日期
    let monthDay = date.getDate();
    let days = new Array(7);
    let weekdays = new Array(7);
    // 计算这一周的星期对应的日期
    for (let i = 0; i <= weekDay; i++) {
      days[i] = monthDay - (weekDay - i) + 1;
      if (i === weekDay - 1) {
        weekdays[i] = "weekToDay";
      } else {
        weekdays[i] = "";
      }
    }
    for (let i = weekDay + 1; i <= 6; i++) {
      days[i] = monthDay + (i - weekDay) + 1;
      weekdays[i] = "";
    }
    // console.log(weekdays);
    this.setData({
      classMonth: parseInt(date.getMonth()) + 1,
      monthDays: days,
      weekToDay: weekdays,
      schedulesHidden:false
    })
  },
  // 渲染课程内容
  showClass: function (resAll) {
    const time = ['08:00', '09:00', '10:10', '11:10', '13:30', '14:30', '15:30', '16:30', '17:30','18:30', '19:30', '20:30', '21:30'];
    let arr = [];
    for (let i = 0; i < 12; i++) {
      // 将数组的每一个坑位初始化为数组
      arr[i] = ['', '', '', '', '', '', ''];
    }
    let arrClass = [];
    for (let i = 0; i < 12; i++) {
      // 将数组的每一个坑位初始化为数组
      arrClass[i] = ['', '', '', '', '', '', ''];
    }
    // console.log(resAll);
    for (let i = 0; i < resAll.data.length; i++) {
      // console.log(i);
      let res = resAll.data[i];
      // console.log(res);
      let startTimeIndex = time.indexOf(res.startTime);
      // console.log("ss",startTimeIndex);
      let endTimeIndex = time.indexOf(res.endTime) - 1;
      // console.log("eee",endTimeIndex);
      let weekDayIndex = this.data.weekDays.indexOf(res.weekTime);
      // console.log("week",weekDayIndex);
      // console.log(startTimeIndex, endTimeIndex, weekDayIndex);
      let classContent = res.className + '@' + res.classPosition;
      for (let j = 0; j < arr.length; j++) {
        if (j >= startTimeIndex && j <= endTimeIndex) {
          arr[j][weekDayIndex] = 'yellow';
        }
        if (j == startTimeIndex) {
          arrClass[j][weekDayIndex] = classContent;
        }
      }
      console.log(arr);
      // console.log(i);
    }
    this.setData({
      classColors: arr,
      classContents: arrClass
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
  clearClass: function () {
    // 内容置空、滑倒顶部
    this.setData({
      valClassName: '',
      valTeacherName: '',
      valPosition: '',
      valStartTime: '',
      valEndTime: '',
      valWeekTime: '',
      scrollTop: 0
    })
  },
  // 表单添加课程 --  数据库操作:
  classSubmmit: function (e) {
    // console.log(e);
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
        weekTime: values.weekTime,
        startTimeIndex:values.startTimeIndex,
        endTimeIndex:values.endTimeIndex
      },
      success: function (res) {
        console.log(res);
        that.setData({
          addInputClassIsHidden: '',
          addFistIsHidden: true
        })
        that.isEmpty();
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  // 关闭添加课程表单:
  closeInputClass: function () {
    this.setData({
      addInputClassIsHidden: 'inputClass-form-close'
    });
  },
  // 课程表办单验证:
  confirmClass: function (values) {
    // 验证时间:
    const time = ['08:00', '09:00', '10:10', '11:10', '13:30', '14:30', '15:30', '16:30', '17:30','18:30', '19:30', '20:30', '21:30'];
    // 检查开始时间
    let startTime = parseInt(values.startTime);
    let startTimeIndex = startTime;
    if (startTime < 0 || startTime > 12) {
      values.startTime = time[11];
    } else {
      values.startTime = time[startTime - 1];
    }
    // 检查结束时间
    let endTime = parseInt(values.endTime);
    let endTimeIndex = endTime;
    if (endTime < 0 || endTime > 12) {
      values.endTime = time[11];
    } else {
      values.endTime = time[endTime];
    }
    values.startTimeIndex = startTimeIndex;
    values.endTimeIndex = endTimeIndex;
    console.log(values);
    return values;
  },
  // 课程详情查询
  getClassInfo: function (e) {
    // console.log('xxxxaaa');
    // console.log(e);
    const time = ['08:00', '09:00', '10:10', '11:10', '13:30', '14:30', '15:30', '16:30', '17:30','18:30', '19:30', '20:30', '21:30'];
    let timeIndex = e.target.dataset.tag;
    console.log(timeIndex);
    let startTimeIndex = timeIndex.split('-')[0] - 1;
    let weekDayIndex = timeIndex.split('-')[1];
    const _ = this._db;
    // 查找对应的课程详情
    let that = this;
    this.db.where( _.and({
      startTime: _.lte(time[startTimeIndex]),
      // endTimeIndex: _.gte(startTimeIndex),
      _openid: that.app.globalData.userCode2Session.openid,
      weekTime:that.data.weekDays[weekDayIndex]
    },{
      endTime: _.gte(time[startTimeIndex+1]),
      _openid: that.app.globalData.userCode2Session.openid,
      weekTime:that.data.weekDays[weekDayIndex]
    })).get({
      success: function (res) {
        console.log(res);
        if (res.data.length > 0) {
          that.setData({
            classInfoShow: 'classInfoShow',
            classInfoHidden: false,
            classInfoName: res.data[0].className,
            classInfoTeacher: res.data[0].teacherName,
            classInfoPosition: res.data[0].classPosition,
            classInfoTime: res.data[0].startTime + " ~ " + res.data[0].endTime + " " + res.data[0].weekTime
          })
        }
      }
    })
  },
  // 课程详情关闭
  closeClassInfo: function () {
    console.log("pppp");
    this.setData({
      classInfoShow: "classInfoShow-close"
    })
  },
  //删除课程
  deleteClass:function() {
    let that = this;
    this.db.where({
      _openid: that.app.globalData.userCode2Session.openid,
      className:that.data.classInfoName,
      teacherName:that.data.classInfoTeacher
    }).get({
      success:function(res) {
        let id = res.data[0]._id;
        that.db.doc(id).remove({
          success:function() {
            that.closeClassInfo();
            that.isEmpty();
          }
        })
      }
    })
  },
  //编辑课程
})