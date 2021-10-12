// pages/invite-other/invite-other.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bx_idd: '',

    //用户授权
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,

    //主动用户的openid
    zhudongOpenId: '',

    //当前用户的openid
    currentOpenId: '',

    bx_imageUrl:'',
    invitorName:''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      bx_idd: options.bx_idd,
      zhudongOpenId: options.CurrentOpenId,
      invitorName:options.invitorName,
      bx_imageUrl:options.bx_imageUrl
    })
    console.log(this.data.bx_idd)

    //获取当前用户openid
    this.getCurrentOpenId()


  },

  //获取当前用户的openid
  getCurrentOpenId() {

    wx.cloud.callFunction({
      name: "getOpenId",
      success: res => {
        console.log(res.result)
        this.setData({
          currentOpenId: res.result.openid
        })
      }
    })

  },


  //接受添加冰箱
  jieshou(e) {

    //添加到分享列表
    var canshu = {}
    canshu.bx_idd = this.data.bx_idd;

    console.log(this.data.bx_idd)

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

          //保存用户信息
          wx.cloud.callFunction({
            name:"user_add",
            data:{
              userData:res.userInfo
            },
            success:res=>{
              console.log(res)
              console.log("保存用户信息")
            }
          })

          wx.setStorageSync("userInfo", res.userInfo)

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })
        },
        complete: () => {
          this.shouQuanHou()
        }
      })

    } else {
      this.shouQuanHou();
    }

  },


  //授权后
  shouQuanHou() {

    var canshu = {}
    canshu.bx_idd = this.data.bx_idd;
    canshu.nickName = app.globalData.userInfo.nickName

    if (this.data.zhudongOpenId == this.data.currentOpenId) {
      wx.showToast({
        title: '不能添加自己的冰箱',
        duration: 2000
      })
      //返回主页
      wx.switchTab({
        url: '/pages/index/index',
      })

    } else {

      wx.showModal({
        title: '提示',
        content: "确定要添加" + "该冰箱？",
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: "bingxiang_share_add",
              data: canshu,
              success: res => {

                console.log(res)
                //返回主页
                wx.switchTab({
                  url: '/pages/index/index',
                })
              },
              fail: err => {
                console.log(err)
              }
            })
          } else if (res.cancel) {
            console.log("用户点击了取消")
            //返回主页
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })

    }

  },

  //拒绝邀请
  jujue(e) {

    wx.showLoading({
      title: '已拒绝邀请',
    })

    setTimeout(function () {
      wx.hideLoading()

      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 1000)

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