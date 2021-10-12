// pages/shiwu/shiwu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    shiwuid: '',
    shiwuData: {},
    leibieNameList: ['蔬菜', '水果', '零食', '茶叶', '奶粉', '药材', '肉蛋', '果汁', '饮用水', '冰淇淋', '方便速食', '煲汤食材', '粮油调味', '水产海鲜', '冷冻食品', '面包蛋糕', '干货杂粮', '其他'],

    //记录
    steps: [{
        text: '步骤一',
        desc: '描述信息',
        inactiveIcon: 'location-o',
        activeIcon: 'success',
      },
      {
        text: '步骤二',
        desc: '描述信息',
        inactiveIcon: 'like-o'
      },
      {
        text: '步骤三',
        desc: '描述信息',
        inactiveIcon: 'like-o'
      },
      {
        text: '步骤四',
        desc: '描述信息',
        inactiveIcon: 'like-o'
      },
    ],
    ShuwuRecordList:[]
  },

  //获取食物详情
  getShiwuDetail() {

    let canshu = {}
    canshu.shiwuid = this.data.shiwuid;

    wx.cloud.callFunction({
      name: "shiwu_detail",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          shiwuData: res.result.data[0]
        })
      }
    })

  },

  //获取食物的操作记录
  getShuwuRecordList() {

    let canshu = {}
    canshu.shiwuid = this.data.shiwuid;

    let records = []

    wx.cloud.callFunction({
      name: "shiwu_record_list",
      data: canshu,
      success: res => {

        console.log(res.result.data)

        for(let i =0; i< res.result.data.length; i++){

          let text = "【"+res.result.data[i].userData.nickName +"】" + res.result.data[i].caozuo;
          let desc = new Date(res.result.data[i].postTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(res.result.data[i].postTime).toTimeString().substr(0, 8);
          let inactiveIcon = 'like-o';
          let record = {};
          record.text = text;
          record.desc = desc;
          record.inactiveIcon = inactiveIcon;
          records.push(record)
        }
      },
      complete:()=>{
        this.setData({
          ShuwuRecordList:records
        })
      }
    })


  },



  //点击查看大图
  clickBigImg(res) {
    wx.previewImage({
      //urls: res.currentTarget.dataset.urls,
      current: res.currentTarget.dataset.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      shiwuid: options.shiwuid
    })

    console.log(this.data.shiwuid)

    this.getShiwuDetail();

    //获取食物的操作记录
    this.getShuwuRecordList();

    console.log(this.data.ShuwuRecordList)
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

  }
})