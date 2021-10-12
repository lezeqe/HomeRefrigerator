// pages/wo/wo.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    nickName: "点击头像授权登录",
    userInfo: {},
    logged: false,
    blogNum: 0,
    collectNum: 0,


    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    //获取缓存
    var userInfo =wx.getStorageSync('userInfo')
    console.log(userInfo)

    if(userInfo.nickName != "微信用户"){
      this.setData({
        userInfo:userInfo,
        canIUseGetUserProfile: true,
        avatarUrl:userInfo.avatarUrl,
        nickName:userInfo.nickName
      })
    }
  
  },


  //跳到轮播图
  TurntoLunbotu(){


    if (app.globalData.userInfo['nickName'] == "微信用户") {

      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = res.userInfo

          wx.setStorageSync("userInfo", res.userInfo)

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })

          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/lunbotu/lunbotu',
            })
          }, 200)
        }
      })

    } else {
      wx.navigateTo({
        url: "/pages/lunbotu/lunbotu"
      })
    }

  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res)
        app.globalData.userInfo = res.userInfo //授权之后要把用户信息存到app里面
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //跳转到关于详情
  TurntoGuanyuDetail() {

    wx.navigateTo({
      url: '/pages/guanyu-detail/guanyu-detail',
    })

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