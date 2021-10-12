// pages/zhitiao-add/zhitiao-add.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    zhitiao: {
      content: ''
    },
    bx_idd: '',
    ztNum:0
  },

  //纸条内容
  textareaAInput(e) {

    console.log(e.detail.value)

    this.setData({
      [`zhitiao.content`]: e.detail.value
    })

  },


  //提交表单
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', this.data.zhitiao)

    wx.showLoading({
      title: '正在保存纸条...',
    })

    //添加纸条的冰箱id
    this.data.zhitiao.bx_idd = this.data.bx_idd;
    this.data.zhitiao.userData = app.globalData.userInfo

    console.log(this.data.zhitiao.content)

    if (this.data.zhitiao.content.replace(/\s*/g, "") != "" && this.data.zhitiao.content.replace(/\s*/g, "") != null) {

      wx.cloud.callFunction({
        name: 'msgsec',
        data: {
          content: this.data.zhitiao.content
        }
      }).then(ckres => {

        console.log(ckres)

        //写审核通过之后的操作 if == 0
        if (ckres.result.errCode == 0) {

          wx.cloud.callFunction({
            name: "zhitiao_add",
            data: this.data.zhitiao,
            success: res => {
              console.log(res)
              wx.hideLoading()
            },
            complete: () => {
              this.showToast()
            }
          })

        } else {
          wx.hideLoading();
          wx.showModal({
            content: '请注意用词',
            showCancel: false
          })
        }
      })

    } else {
      wx.showToast({
        title: "输入内容为空",
        icon: "error",
        duration: 1000
      })
    }



  },

  //发布成功后的操作
  showToast() {
    wx.showToast({
      title: '发布成功',
      duration: 500
    })
    setTimeout(() => {
      var secondPage = getCurrentPages()[1]
      secondPage.setData({
        zhitiao: '',
        active: 1
      })
      secondPage.getZhitiaoList(0,true,false)
      wx.navigateBack()
    }, 500)
  },

  //重置
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail)
    this.setData({
      zhitiao: ''
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      bx_idd: options.bx_idd,
      ztNum:options.ztNum
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