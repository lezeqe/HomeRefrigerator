import common from "../../utils/common.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addName: "",
    fileList: [],
    tapIdx: 1,

    currentOpenId: ''
  },
  //监听数据的内容
  onChange(e) {
    var val = e.detail.value
    if (val.length > 0) {
      this.setData({
        btnDis: false
      })
    } else {
      this.setData({
        btnDis: true
      })
    }
  },


  //提交表单
  onSubmit(res) {

    //判空提示
    if (this.data.fileList.length == 0) {
      wx.showToast({
        title: '请上传图片',
        duration: 1000
      })
      return false
    }


    wx.showLoading({
      title: '图片保存中...'
    })

    var userData = app.globalData.userInfo

    var subData = {
      userData
    }
    var {
      fileList
    } = this.data
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1
    var day = d.getDate();
    month = month < 10 ? "0" + month : month + ""
    day = day < 10 ? "0" + day : day + ""
    var newDate = year + month + day;

    if (fileList.length > 0) {

      var uploading = fileList.map((item, idx) => {

        //console.log(item)
        return this.uploadFilePromise("lunbotu/" + newDate + "/" +
          common.guid() +
          item.url.match(/\.[^.]+?$/), item)
      })

      Promise.all(uploading).then(res => {

        console.log(res)

        var newFileArr = res.map(item => {
          return item.fileID
        })

        console.log(newFileArr)

        wx.cloud.callFunction({
          name: 'imageSec',
          data: {
            fileIDs: newFileArr
          },
          success: res => {
            console.log(res)

            if (res.result.success == true) {
              // wx.showLoading({
              //   title: '轮播图保存中...'
              // })
              subData.imgUrl = newFileArr
              this.pushCloud(subData);
            } else {
              wx.showLoading({
                title: '图片违规',
              })

              setTimeout(function () {
                wx.hideLoading()
              }, 1000)

            }

          },
          fail: err => {
            console.log(err);

            wx.showLoading({
              title: '图片违规',
            })

            setTimeout(function () {
              wx.hideLoading()
            }, 2000)


          }
        })


        // subData.imgUrl = newFileArr
        // this.pushCloud(subData);

      })

      return;
    }


    this.pushCloud(subData)

  },

  //发布成功后的操作
  showToast() {
    wx.showToast({
      title: '保存成功',
      duration: 1000
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)

  },

  // 进行云存储
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url
    })
  },

  //发送到云函数
  pushCloud(subData) {
    wx.cloud.callFunction({

      name: "lunbotu_add",
      data: subData,
      success: res => {
        console.log(res)
        wx.hideLoading()
        this.showToast()
      }
    })
  },

  //处理图像
  afterReadImg(res) {
    console.log(res)
    var oldArr = this.data.fileList
    var newArr = oldArr.concat(res.detail.file)
    this.setData({
      fileList: newArr
    })
  },

  //删除图像
  delImg(res) {
    console.log(res)
    var idx = res.detail.index
    this.data.fileList.splice(idx, 1);
    this.setData({
      fileList: this.data.fileList
    })
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

  }
})