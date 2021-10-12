// pages/bx-add/bx-add.js

import common from "../../utils/common.js"


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    bingxiang: {
      imgList: [], //封面，不是存进数据库的
      bx_name: '', //冰箱昵称
      bx_location: '', //冰箱位置
      bx_backup: '', //冰箱备注
      imageUrl: '', //封面url
    }

  },


  //冰箱昵称
  bxNameInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`bingxiang.bx_name`]: e.detail.value
    })
  },

  //冰箱位置
  bxLocationInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`bingxiang.bx_location`]: e.detail.value
    })
  },

  //冰箱备注
  textareaAInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`bingxiang.bx_backup`]: e.detail.value
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

  },


  //封面上传
  ChooseImage(e) {

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var second = d.getSeconds();
    month = month < 10 ? "0" + month : month + "";
    day = day < 10 ? "0" + day : day + "";

    var newDate = year + month + day;
    var hourSecond = hour + "" + second;


    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {

        console.log(res)

        this.setData({
          [`bingxiang.imgList`]: res.tempFilePaths
        })

        var cp = "bingxiang/" + newDate + "/" + hourSecond + "/" + common.guid() + res.tempFilePaths[0].match(/\.[^.]+?$/)[0]

        wx.cloud.uploadFile({
          cloudPath: cp,
          filePath: res.tempFilePaths[0], // 文件路径
        }).then(pres => {

          console.log(pres.fileID)
          this.setData({
            [`bingxiang.imageUrl`]: pres.fileID
          })

        }).catch(error => {
          console.log(error)
        })

      }

    })

  },

  //发布成功后的操作
  showToast() {
    wx.showToast({
      title: '添加成功',
      duration: 500
    })
    setTimeout(() => {
      var indexPage = getCurrentPages()[0]
      indexPage.setData({
        bingxiangList: [] //这是为什么呢？
      })
      indexPage.getBingxiangList()
      wx.navigateBack()
    }, 300)
  },


  //查看封面
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.bingxiang.imgList,
      current: e.currentTarget.dataset.url //??????
    });
    console.log(e.currentTarget.dataset)
  },

  //删除封面
  DelImg(e) {
    wx.showModal({
      // title: '封面是非必填项',
      content: '确定要删除这张封面吗？',
      cancelText: '不删除',
      confirmText: '确认删除',
      success: res => {
        if (res.confirm) {
          this.data.bingxiang.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            [`bingxiang.imgList`]: this.data.bingxiang.imgList
          })
        }
      }
    })
  },

  // 上传图片    -- 用不上，留着研究
  uploadToCloud() {
    wx.cloud.init();

    console.log()

    if (!this.data.bingxiang.imgList.length) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
    } else {
      const uploadTasks = this.data.bingxiang.imgList.map((file, index) =>
        this.uploadFilePromise(`my-photo${index}.png`, file));


      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          const newFileList = data.map(item => {
            url: item.fileID
          });
          this.setData({
            cloudPath: data,
            fileList: newFileList
          });

          console.log()


        })
        .catch(e => {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.log(e);
        });
    }
  },


  //上传一张图片

  uploadImage2() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var second = d.getSeconds();
    month = month < 10 ? "0" + month : month + "";
    day = day < 10 ? "0" + day : day + "";

    var newDate = year + month + day;
    var hourSecond = hour + "" + second;

    var cp = "bingxiang/" + newDate + "/" + hourSecond + "/" + common.guid() + this.data.bingxiang.imgList[0].match(/\.[^.]+?$/)[0]

    wx.cloud.uploadFile({

      // 指定上传到的云路径
      cloudPath: cp,
      // 指定要上传的文件的小程序临时文件路径
      filePath: this.data.bingxiang.imgList[0],
      // 成功回调
      success: res => {
        console.log('上传成功', res.fileID)
        this.setData({
          [`bingxiang.imageUrl`]: res.fileID
        })
        return res.fileID;
      },
    })

  },


  //提交表单
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)

    if (this.data.bingxiang.bx_name.replace(/\s*/g, "") == "" || this.data.bingxiang.bx_name.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '请输入名称',
        duration: 1000
      })
      return false
    }

    if (this.data.bingxiang.bx_location.replace(/\s*/g, "") == "" || this.data.bingxiang.bx_location.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '请输入位置',
        duration: 1000
      })
      return false
    }

    wx.showLoading({
      title: '保存中...',
    })

    this.data.bingxiang.faqizhe = app.globalData.userInfo;

    //文本检测
    let wenben = new Promise((resolve, reject) => {

      wx.cloud.callFunction({
        name: 'msgsec',
        data: {
          content: this.data.bingxiang.bx_name + this.data.bingxiang.bx_backup + this.data.bingxiang.bx_location
        },
        success: wbres => {
          console.log(wbres)
          resolve(wbres)
        }
      })
    })


    //图片检测
    let tupian = new Promise((resolve, reject) => {

      wx.cloud.callFunction({
        name: 'imageSec_yi',
        data: {
          imageFileid: this.data.bingxiang.imageUrl
        },
        success: tpres => {

          console.log(tpres)
          resolve(tpres)
        }
      })
    })


    if (this.data.bingxiang.imgList.length != 0) {

      //内容检测
      Promise.all([wenben, tupian]).then((pres) => {
        console.log(pres)

        if (pres[0].result.errCode == 87014) {
          wx.hideLoading();
          wx.showModal({
            // title: '提醒',
            content: '用词违规',
            showCancel: false
          })
        }

        if (pres[1].result.errCode == 87014) {
          wx.hideLoading();
          wx.showModal({
            // title: '提醒',
            content: '图片违规',
            showCancel: false
          })
        }


        if (pres[0].result.errCode == 0 && pres[1].result.errCode == 0) {
          //添加冰箱的资料
          wx.cloud.callFunction({
            name: "bingxiang_add",
            data: this.data.bingxiang,
            success: bres => {

              console.log(bres)
              wx.hideLoading()
            },
            fail: berr => {
              console.log(berr)
            },
            complete: () => {
              this.showToast();
            }
          })

        }


      }).catch((perr) => {
        console.log(perr)
      })


    } else {

      this.data.bingxiang.imageUrl = "https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/bingxiang/Snipaste_2021-06-25_11-22-11.png?sign=208bc2b2a586e6f2293efd546e1bfc47&t=1624591398"


      Promise.all([wenben]).then((pres) => {

        if (pres[0].result.errCode == 87014) {
          wx.hideLoading();
          wx.showModal({
            title: '提醒',
            content: '用词违规',
            showCancel: false
          })
        } else {
          wx.cloud.callFunction({
            name: "bingxiang_add",
            data: this.data.bingxiang,
            success: res => {
              console.log(res)
              wx.hideLoading()
            },
            fail: err => {
              console.log(err)
            },
            complete: () => {
              this.showToast();
            }
          })
        }

      })



    }


  },

  //重置
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail)
    this.setData({
      bingxiang: ''
    })
  },


})