// pages/bingxiang/bingxiang.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    idd: '',
    bx_name: '',
    bx_location: '',
    bx_imageUrl: '',

    BXshiwuList: [], //当前冰箱的食物列表

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0, //原本是0
    list: [],
    load: true,

    shiwuList: [],

    shiyuList: [{
        "name": 0,
        "value": 0
      },
      {
        "name": 25,
        "value": 0.25
      },
      {
        "name": 50,
        "value": 0.5
      },
      {
        "name": 75,
        "value": 0.75
      },
      {
        "name": 100,
        "value": 1
      }
    ],
    shiwuName: '',
    shiwuid: '',
    shengyuBili: '',
    shiwunum: '',
    zhitiaoList: [],

    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,

    GQshiwuList: [], //过期食物列表
    LQshiwuList: [], //临期食物列表
    DayShiwuList14: [], //存进超过14天食物列表
    NoGQshiwuList: [], //无过期日期的食物
    QCshiwuList: [], //已完全取出

    bx_idd: '',
    leibieNameList: ['蔬菜', '水果', '零食', '茶酒', '奶粉', '药材', '肉蛋', '熟食', '果汁', '饮用水', '冰淇淋', '方便速食', '煲汤食材', '粮油调味', '水产海鲜', '冷冻食品', '面包蛋糕', '干货杂粮', '其他'],


    //当前用户的openid
    CurrentOpenId: '',

    //统计
    activeNames: ['0'],

    //share number
    shareNum: '',

    isLoading:false,

    isDel:false,
    isAdd:false,

    //到底
    isDaoDi:false,

   

  },

   //获取当前用户id
   getCurrentOpenId() {

    wx.cloud.callFunction({
      name: "getOpenId",
      success: res => {
        console.log(res.result)
        this.setData({
          CurrentOpenId: res.result.openid
        })

        wx.setStorageSync('CurrentOpenId', res.result.openid)
      }
    })

   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //初始化参数
    this.setData({
      bx_idd: options.idd,
      bx_name: options.bx_name,
      bx_location: options.bx_location,
      bx_imageUrl: options.imageUrl,
      CurrentOpenId: options.CurrentOpenId || wx.getStorageSync('CurrentOpenId'),
      shareNum: options.shareNum
    })

    console.log(options.shareNum)

    wx.setStorageSync('CurrentOpenId', options.CurrentOpenId)

    //this.data.CurrentOpenId =wx.getStorageSync('CurrentOpenId')


    //获取当前冰箱的食物列表
    this.getBXshiwuList()

    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    //获取纸条列表
    this.getZhitiaoList();

    this.getCurrentOpenId();

  },

  //统计
  onChangeTJ(event) {
    this.setData({
      activeNames: event.detail,
    });

    console.log(event)

  },

  onChange(event) {

    console.log(event.detail.index)

    this.setData({
      active: event.detail.index
    });

    if (event.detail.index == 2) {
      //获取过期食物列表
      this.getGQshiwuList();

      //获取临期食物列表
      this.getLQshiwuList();

      //超过14天
      this.getLQshiwuList();

      //无过期日期
      this.getNoGQshiwuList();

      console.log(this.data.CurrentOpenId)

      this.getQuchuShiwuList();

    }

  },


  //跳转到添加物品的页面
  turnToAddBx(e) {
    wx.navigateTo({
      url: '/pages/shiwu-add/shiwu-add?bx_idd=' + this.data.bx_idd,
    })
  },

  //获取当前冰箱的食物
  getBXshiwuList() {

    let canshu = {}
    canshu.bx_idd = this.data.bx_idd

    wx.cloud.callFunction({
      name: "shiwu_list2",
      data: canshu,
      success: res => {
        console.log(res.result)
        this.setData({
          BXshiwuList: res.result
        })
      },
      complete: () => {
        for (let i = 0; i < this.data.BXshiwuList.length; i++) {
          this.data.BXshiwuList[i].id = i;
          this.data.BXshiwuList[i].name = this.data.BXshiwuList[i].leibie;
        }
        this.setData({
          BXshiwuList: this.data.BXshiwuList,
          listCur: this.data.BXshiwuList[0]
        })
      }
    })

  },

  getQuchuShiwuList() {
    let canshu = {}
    canshu.bx_idd = this.data.bx_idd;

    wx.cloud.callFunction({
      name: "shiwu_quchu_list",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          QCshiwuList: res.result.data
        })
      }
    })
  },


  tabSelect(e) {
    console.log("TabCur")
    console.log(e.currentTarget.dataset.id)
    console.log("MainCur")
    console.log(e.currentTarget.dataset.id)

    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })

    console.log(this.data.VerticalNavTop)
  },

  VerticalMain(e) {
    let that = this;
    let list = this.data.BXshiwuList;

    console.log("list")
    console.log(list)

    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        BXshiwuList: list,
        shiwuList: list
      })

    }
    let scrollTop = e.detail.scrollTop + 20;

    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }

  },

  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      shiwuName: e.currentTarget.dataset.name,
      shiwuid: e.currentTarget.dataset.shiwuid,
      shiwunum: e.currentTarget.dataset.shiwunum

    })
  },
  hideModal(e) {
    console.log(e)

    this.setData({
      modalName: null
    })
  },


  //点击出库的按钮
  chukuBut() {

    let canshu = {}
    canshu.shiwuid = this.data.shiwuid;
    canshu.newNum = this.data.shiwunum * this.data.shengyuBili

    console.log(canshu.shiwuid)
    console.log(canshu.newNum)
    console.log(this.data.shiwunum)
    console.log(this.data.shengyuBili)

    if (this.data.shengyuBili != null && this.data.shengyuBili != "") {

      //如果剩下比例为0，则删除该食物
      if (this.data.shengyuBili == 0) {

        let canshu = {};
        canshu.shiwuid = this.data.shiwuid

        wx.cloud.callFunction({
          name: "shiwu_delete",
          data: canshu,
          success: res => {
            console.log("111111111111111111111111111111")
            this.getBXshiwuList()
          },
          complete: () => {

            //新增记录
            let shiwuRecord = {}
            shiwuRecord.userData = app.globalData.userInfo;
            shiwuRecord.shiwuid = this.data.shiwuid;
            shiwuRecord.shiwuName = this.data.shiwuName;
            shiwuRecord.caozuo = "已全部取出"

            wx.cloud.callFunction({
              name: "shiwu_record",
              data: shiwuRecord,
              success: res => {
                console.log("-----------------------")
              }
            })

          }
        })
      } else {

        //取消之后，应该去修改数据库
        wx.cloud.callFunction({
          name: "shiwu_chuku",
          data: canshu,
          success: res => {
            console.log(res)
            this.getBXshiwuList()
          },
          complete: () => {

            //新增记录
            let shiwuRecord = {}
            shiwuRecord.userData = app.globalData.userInfo;
            shiwuRecord.shiwuid = this.data.shiwuid;
            shiwuRecord.shiwuName = this.data.shiwuName;
            //shiwuRecord.quchuBili = (1-this.data.shengyuBili) *100
            shiwuRecord.caozuo = "取出了" + (1 - this.data.shengyuBili) * 100 + "%"

            wx.cloud.callFunction({
              name: "shiwu_record",
              data: shiwuRecord,
              success: res => {
                console.log("-----------------------")
              }
            })

          }
        })

      }

    }
    this.setData({
      modalName: null
    })

  },

  //点击出库的按钮--统计--已过期--取出
  chukuBut1() {

    let canshu = {}
    canshu.shiwuid = this.data.shiwuid;
    canshu.newNum = this.data.shiwunum * this.data.shengyuBili

    console.log(canshu.shiwuid)
    console.log(canshu.newNum)
    console.log(this.data.shiwunum)
    console.log(this.data.shengyuBili)

    if (this.data.shengyuBili != null && this.data.shengyuBili != "") {

      //如果剩下比例为0，则删除该食物
      if (this.data.shengyuBili == 0) {

        let canshu = {};
        canshu.shiwuid = this.data.shiwuid

        wx.cloud.callFunction({
          name: "shiwu_delete",
          data: canshu,
          success: res => {
            //获取过期食物列表
            this.getGQshiwuList();

            //获取临期食物列表
            this.getLQshiwuList();

          },
          complete: () => {

            //新增记录
            let shiwuRecord = {}
            shiwuRecord.userData = app.globalData.userInfo;
            shiwuRecord.shiwuid = this.data.shiwuid;
            shiwuRecord.shiwuName = this.data.shiwuName;
            shiwuRecord.caozuo = "已全部取出"

            wx.cloud.callFunction({
              name: "shiwu_record",
              data: shiwuRecord,
              success: res => {
                console.log("-----------------------")
              }
            })

          }
        })
      } else {

        //取消之后，应该去修改数据库
        wx.cloud.callFunction({
          name: "shiwu_chuku",
          data: canshu,
          success: res => {
            console.log(res)
            this.getBXshiwuList()
          },
          complete: () => {

            //新增记录
            let shiwuRecord = {}
            shiwuRecord.userData = app.globalData.userInfo;
            shiwuRecord.shiwuid = this.data.shiwuid;
            shiwuRecord.shiwuName = this.data.shiwuName;
            //shiwuRecord.quchuBili = (1-this.data.shengyuBili) *100
            shiwuRecord.caozuo = "取出了" + (1 - this.data.shengyuBili) * 100 + "%"

            wx.cloud.callFunction({
              name: "shiwu_record",
              data: shiwuRecord,
              success: res => {
                console.log("-----------------------")
              }
            })

          }
        })

      }

    }
    this.setData({
      modalName: null
    })

  },


  //彻底删除取出的记录
  deleteSWJL(e) {

    console.log(e)

    let shiwuName = e.currentTarget.dataset.name;
    let shiwuid = e.currentTarget.dataset.shiwuid;

    wx.showModal({
      title: '提示',
      content: "确定永久删除'" + shiwuName + "'？",
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "shiwu_delete_yichuku",
            data: {
              shiwuid: shiwuid
            },
            success: res => {
              this.getQuchuShiwuList()
            },
            fail: err => {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log("用户点击了取消")
        }
      }
    })

  },


  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      shengyuBili: e.detail.value
    })
  },

  //跳转到食物详情
  TurntoSW(e) {

    console.log("转到食物详情")

    console.log(e.currentTarget.dataset.shiwuid)

    wx.navigateTo({
      url: '/pages/shiwu/shiwu?shiwuid=' + e.currentTarget.dataset.shiwuid,
    })

  },


  //跳转到添加纸条的页面
  turnToAddZhitiao() {

    //这里应该判断授权
    if (app.globalData.userInfo['nickName'] == "微信用户") {

      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = res.userInfo;

          wx.setStorageSync("userInfo", res.userInfo)

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })

          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/zhitiao-add/zhitiao-add?bx_idd=' + this.data.bx_idd+'&ztNum='+this.data.zhitiaoList.length,
            })
          }, 500)
        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/zhitiao-add/zhitiao-add?bx_idd=' + this.data.bx_idd,
      })
    }

  },

  //获取纸条列表
  getZhitiaoList(num=0,isAdd=false,isDel=false) {
    let canshu = {}
    canshu.bx_idd = this.data.bx_idd;
    //canshu.num = num;

    if(isAdd == false && isDel==false){
      canshu.num = num;
    }else{
      canshu.num = 0;
      this.setData({
        zhitiaoList:[]
      })
    }

    console.log(canshu.bx_idd)

    wx.cloud.callFunction({
      name: "zhitiao_list",
      data: canshu,
      success: res => {

        var newDataList = [...this.data.zhitiaoList,...res.result.data]

        console.log(res)

        console.log(newDataList)

        if(res.result.data.length ==0){
          this.setData({
            isLoading:false,
            isDaoDi:true
          })
        }

        this.setData({
          zhitiaoList: newDataList
        })

      }
    })
  },


  //获取过期食物
  getGQshiwuList() {

    let canshu = {}
    canshu.bx_idd = this.data.bx_idd

    wx.cloud.callFunction({
      name: "shiwu_guoqi_list",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          GQshiwuList: res.result.data
        })
      }
    })

  },

  //获取临期食物列表
  getLQshiwuList() {
    let canshu = {}
    canshu.bx_idd = this.data.bx_idd

    console.log("123111111111111111111")

    wx.cloud.callFunction({
      name: "shiwu_linqi_list",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          LQshiwuList: res.result.data
        })
        console.log(res.result.data)
      },
      fail: err => {
        console.log(err)
      }
    })

  },

  //获取存进超过14天的食物列表
  getShiwuListDay14() {
    let canshu = {}
    canshu.bx_idd = this.data.bx_idd

    wx.cloud.callFunction({
      name: "shiwu_day14",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          DayShiwuList14: res.result.data
        })
      }
    })

  },

  //获取无过期日期的食物列表
  getNoGQshiwuList() {
    let canshu = {}
    canshu.bx_idd = this.data.bx_idd

    wx.cloud.callFunction({
      name: "shiwu_no_guoqi",
      data: canshu,
      success: res => {
        console.log(res)
        this.setData({
          NoGQshiwuList: res.result.data
        })
      }
    })

  },

  //删除纸条
  shanchuZT(e) {
    let ztid = e.currentTarget.dataset.ztid;

    let canshu = {};
    canshu.ztid = ztid;

    wx.showModal({
      title: '提示',
      content: "确定要删除'" + "'该纸条？",
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "zhitiao_delete",
            data: canshu,
            success: res => {

              this.setData({
                isAdd:false,
                isDel:true
              })

              this.getZhitiaoList(0,this.data.isAdd,this.data.isDel)
            },
            fail: err => {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log("用户点击了取消")
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //来自垂直索引列表
    wx.hideLoading()
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

    this.setData({
      isLoading:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);


    

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var Num = this.data.zhitiaoList.length

    this.getZhitiaoList(Num)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {


    //当人数超过8人就出问题了。
    if (this.data.shareNum > 8) {
      wx.showModal({
        title: '提醒',
        content: '分享不能超过8人',
        showCancel: false
      })
      return false
    } else {

      return {

        title: app.globalData.userInfo['nickName'] + '邀请你共同使用冰箱：', // 图片标题
        path: '/pages/invite-other/invite-other?bx_idd=' + this.data.bx_idd + '&CurrentOpenId=' + this.data.CurrentOpenId + '&invitorName=' + app.globalData.userInfo.nickName + '&bx_imageUrl=' + this.data.bx_imageUrl, //分享路径 ,code可以是邀请码,也可以是分享某个具体商品的id,如果是邀请码就是后端给你的
        imageUrl: this.data.bx_imageUrl, //图片地址,也可以不设置,就会默认当前缩略图作为分享封面男
        success: (res) => {
          console.log(res)
        }


      }
    }

  }

})