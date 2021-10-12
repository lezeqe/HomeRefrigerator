// pages/shiwu-add-test/shiwu-add-test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jibie: '',
    first: '',
    second: '',
    jieshi: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //冰箱昵称
    jibieInput(e) {
      console.log(e.detail.value)
      this.setData({
        jibie: e.detail.value
      })
    },
  
    firstInput(e) {
      console.log(e.detail.value)
      this.setData({
        first: e.detail.value
      })
    },
  
    secondInput(e) {
      console.log(e.detail.value)
      this.setData({
        second: e.detail.value
      })
    },
  
    jieshiInput(e) {
      console.log(e.detail.value)
      this.setData({
        jieshi: e.detail.value
      })
    },
  

  
    //提交表单
    formSubmit(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail)
  
  
      var subData = {}
      subData.jibie = Number(this.data.jibie)
      subData.first = this.data.first
      subData.second = this.data.second
      subData.jieshi = this.data.jieshi

  
      wx.cloud.callFunction({
        name:"shiwu_baike_add",
        data:subData,
        success:res=>{
          console.log(res)
        }
      })
    },
  
  
    //重置
    formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail)
      this.setData({
        first: '',
        second: '',
        jieshi: ''
      })
    }
})