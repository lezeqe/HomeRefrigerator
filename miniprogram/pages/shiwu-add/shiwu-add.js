const app = getApp();

import common from "../../utils/common.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    sourcePicker: ['线上购买', '线下购买', '自家做的', '别人送的'],
    locationPicker: ['上', '中', '下'],
    date: '2020-01-01',

    //物品
    shiwu: {
      name: '',
      weight: '',
      price: '',
      num: '',
      source: '',
      sourceIndex: '',
      kind: '',
      kindIndex: '',
      location: '',
      locationIndex: '',
      productionDate: '',
      productionSJC: '',
      expirationDate: '',
      expirationSJC: '',
      backup: '',
      shiwuImage: '',
      locationImage: '',
      useTime: 2000

    },
    imgList: [],
    imgList2: [],
    leibieList: [],
    leibieNameList: ['蔬菜', '水果', '零食', '茶酒', '奶粉', '药材', '肉蛋', '熟食', '果汁', '饮用水', '冰淇淋', '方便速食', '煲汤食材', '粮油调味', '水产海鲜', '冷冻食品', '面包蛋糕', '干货杂粮', '其他'],
    bx_idd: '',

    shiwuid: '', //添加食物后，返回的食物记录

    isSafe: true, //图片是否安全的标志

  },

  getLeibieList() {

    wx.cloud.callFunction({
      name: "shiwu_leibie_list",
      success: res => {
        console.log(res)
        this.setData({
          leibieList: res.result.data
        })
      }
    })
  },

  //选择来源
  sourcePickerChange(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.source`]: this.data.sourcePicker[e.detail.value],
      [`shiwu.sourceIndex`]: e.detail.value
    })

  },

  //选择类别
  kindPickerChange(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.kind`]: this.data.leibieList[e.detail.value]._id,
      [`shiwu.kindIndex`]: e.detail.value
    })

  },

  //选择位置
  locationPickerChange(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.location`]: this.data.locationPicker[e.detail.value],
      [`shiwu.locationIndex`]: e.detail.value
    })
  },


  //名称
  nameInput(e) {
    console.log(e)
    console.log("输入名称")


    this.setData({
      [`shiwu.name`]: e.detail.value
    })
  },

  //重量
  weightInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.weight`]: e.detail.value
    })
  },

  //价格
  priceInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.price`]: e.detail.value
    })
  },

  //数量
  numInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.num`]: e.detail.value
    })
  },

  //备注
  backupInput(e) {
    console.log(e.detail.value)

    this.setData({
      [`shiwu.backup`]: e.detail.value
    })
  },

  //生产日期选择
  productionDateChange(e) {
    console.log(e.detail.value)
    this.setData({
      [`shiwu.productionDate`]: e.detail.value,
      [`shiwu.productionSJC`]: new Date(e.detail.value).getTime()
    })
  },

  //过期日期选择
  expirationDateChange(e) {
    console.log(e.detail.value)
    this.setData({
      [`shiwu.expirationDate`]: e.detail.value,
      [`shiwu.expirationSJC`]: new Date(e.detail.value).getTime()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取食物列别列表
    this.getLeibieList();

    this.setData({
      bx_idd: options.bx_idd
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
    choose

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //封面上传
  // ChooseImage(e) {
  //   wx.chooseImage({
  //     count: 1, //默认9
  //     sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], //从相册选择
  //     success: (res) => {
  //       this.setData({
  //         imgList: res.tempFilePaths
  //       })
  //       console.log(res)



  //     },
  //     fail: err => {
  //       console.log(err)
  //     }
  //   });
  // },


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
          imgList: res.tempFilePaths
        })

        var cp = "shiwu/" + newDate + "/" + hourSecond + "/" + common.guid() + res.tempFilePaths[0].match(/\.[^.]+?$/)[0]

        // new Promise((resolve, reject) => {
        //   wx.cloud.uploadFile({
        //     cloudPath: res.tempFilePaths[0],
        //     filePath: cp, // 文件路径
        //   }).then(pres => {

        //     console.log(pres.fileID)
        //     resolve(pres)

        //   }).catch(error => {
        //     console.log(error)
        //   })
        // }).then((tres)=>{
        //   console.log(tres)
        //   this.setData({
        //     [`bingxiang.imageUrl`]: tres.fileID
        //   })
        // })


        wx.cloud.uploadFile({
          cloudPath: cp,
          filePath: res.tempFilePaths[0], // 文件路径
        }).then(pres => {

          console.log(pres.fileID)
          this.setData({
            [`shiwu.shiwuImage`]: pres.fileID
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
      var indexPage = getCurrentPages()[1]
      indexPage.setData({
        BXshiwuList: []
      })
      indexPage.getBXshiwuList()
      wx.navigateBack()
    }, 500)
  },


  //查看封面
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    console.log(e.currentTarget.dataset)
  },

  //删除封面
  DelImg(e) {
    wx.showModal({
      title: '建议上传物品图片',
      content: '确定要删除这张图片吗？',
      cancelText: '不删除',
      confirmText: '确认删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  //生成从minNum到maxNum的随机数
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },



  //提交表单
  formSubmit(e) {

    console.log("提交时间点")
    console.log(e)
    console.log(e.timeStamp)
    if (e.timeStamp < 10000) {
      this.data.shiwu.useTime = e.timeStamp
    } else if (e.timeStamp <= 20000 && e.timeStamp >= 10000) {
      this.data.shiwu.useTime = e.timeStamp - this.randomNum(6088, 8999)
    } else if (e.timeStamp <= 25000 && e.timeStamp >= 20000) {
      this.data.shiwu.useTime = e.timeStamp - this.randomNum(10000, 12000)
    } else {
      this.data.shiwu.useTime = this.randomNum(18000, 40000)
    }

    console.log('form发生了submit事件，携带数据为：', this.data.shiwu)

    if (this.data.shiwu.name.replace(/\s*/g, "") == "" || this.data.shiwu.name.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '请输入名称',
        duration: 1000
      })
      return false
    }

    if (this.data.shiwu.kind.replace(/\s*/g, "") == "" || this.data.shiwu.kind.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '请选择类别',
        duration: 1000
      })
      return false
    }

    if (this.data.shiwu.location.replace(/\s*/g, "") == "" || this.data.shiwu.location.replace(/\s*/g, "") == null) {
      wx.showToast({
        title: '请选择位置',
        duration: 1000
      })
      return false
    }


    wx.showLoading({
      title: '保存中...',
    })

    this.data.shiwu.bx_idd = this.data.bx_idd;
    this.data.shiwu.userData = app.globalData.userInfo; //增加操作者的信息

    //文本检测
    let wenben = new Promise((resolve, reject) => {

      wx.cloud.callFunction({
        name: 'msgsec',
        data: {
          content: this.data.shiwu.name + this.data.shiwu.backup
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
          imageFileid: this.data.shiwu.shiwuImage
        },
        success: tpres => {

          console.log(tpres)
          resolve(tpres)
        }
      })
    })

    if (this.data.imgList.length != 0) {



      // wx.cloud.callFunction({
      //   name: 'msgsec',
      //   data: {
      //     content: this.data.shiwu.name + this.data.shiwu.backup
      //   }
      // }).then(ckres => {

      //   //写审核通过之后的操作 if == 0
      //   if (ckres.result.errCode == 0) {
      //     wx.cloud.uploadFile({

      //       // 指定上传到的云路径
      //       cloudPath: cp,
      //       // 指定要上传的文件的小程序临时文件路径
      //       filePath: this.data.imgList[0],
      //       // 成功回调
      //       success: res => {
      //         console.log('上传成功', res.fileID)
      //         this.setData({
      //           [`shiwu.shiwuImage`]: res.fileID
      //         })

      //         wx.cloud.callFunction({
      //           name: "imageSec_yi",
      //           data: {
      //             imageFileid: this.data.shiwu.shiwuImage
      //           },
      //           success: res => {
      //             console.log(res)

      //             if (res.result.errCode == 87014) {
      //               wx.hideLoading();
      //               wx.showModal({
      //                 title: '提醒',
      //                 content: '图片违规',
      //                 //showCancel: false
      //               })
      //             } else {

      //               //添加食物
      //               wx.cloud.callFunction({
      //                 name: "shiwu_add",
      //                 data: this.data.shiwu,
      //                 success: res => {
      //                   console.log("999999999999999")
      //                   console.log(res.result._id) //返回的是记录的id

      //                   //添加记录
      //                   let shiwuRecord = {}
      //                   shiwuRecord.userData = app.globalData.userInfo;
      //                   shiwuRecord.shiwuid = res.result._id;
      //                   shiwuRecord.shiwuName = this.data.shiwu.name;
      //                   shiwuRecord.caozuo = "添加了" + "'" + this.data.shiwu.name + "'";

      //                   wx.cloud.callFunction({
      //                     name: "shiwu_record",
      //                     data: shiwuRecord,
      //                     success: res => {
      //                       console.log("-----------------------")
      //                     }
      //                   })

      //                   wx.hideLoading()
      //                 },
      //                 fail: err => {
      //                   console.log(err)
      //                 },
      //                 complete: () => {
      //                   this.showToast();
      //                 }
      //               })
      //             }

      //           },
      //           fail: err => {
      //             wx.hideLoading();
      //             wx.showModal({
      //               title: '提醒',
      //               content: '网络异常',
      //               //showCancel: false
      //             })
      //           }
      //         })

      //       },

      //     })
      //   } else {
      //     wx.hideLoading();
      //     wx.showModal({
      //       title: '提醒',
      //       content: '用词违规',
      //       //showCancel: false
      //     })

      //   }
      // })


      //内容检测
      Promise.all([wenben, tupian]).then((pres) => {
        console.log(pres)

        if (pres[0].result.errCode == 87014) {
          wx.hideLoading();
          wx.showModal({
            title: '提醒',
            content: '用词违规',
            showCancel: false
          })
        }

        if (pres[1].result.errCode == 87014) {
          wx.hideLoading();
          wx.showModal({
            title: '提醒',
            content: '图片违规',
            showCancel: false
          })
        }

        if (pres[0].result.errCode == 0 && pres[1].result.errCode == 0) {
          //添加冰箱的资料
          wx.cloud.callFunction({
            name: "shiwu_add",
            data: this.data.shiwu,
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

      this.data.shiwu.shiwuImage = "https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/shiwu/Snipaste_2021-06-28_12-15-34.png?sign=ebc1308021b67c603576c302695e0ec7&t=1624853782"


      wx.cloud.callFunction({
        name: 'msgsec',
        data: {
          content: this.data.shiwu.name + this.data.shiwu.backup
        }
      }).then(ckres => {

        //写审核通过之后的操作 if == 0
        if (ckres.result.errCode == 0) {
          wx.cloud.callFunction({
            name: "shiwu_add",
            data: this.data.shiwu,
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
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提醒',
            content: '用词违规',
            showCancel: false
          })

        }
      })

    }





    // if (this.data.bingxiang.imgList.length != 0) {

    //   var cp = "bingxiang/" + newDate + "/" + hourSecond + "/" + common.guid() + this.data.bingxiang.imgList[0].match(/\.[^.]+?$/)[0]


    //   wx.cloud.callFunction({
    //     name: 'msgsec',
    //     data: {
    //       content: this.data.bingxiang.bx_name + this.data.bingxiang.bx_backup + this.data.bingxiang.bx_location
    //     }
    //   }).then(ckres => {

    //     //写审核通过之后的操作 if == 0
    //     if (ckres.result.errCode == 0) {
    //       wx.cloud.uploadFile({

    //         // 指定上传到的云路径
    //         cloudPath: cp,
    //         // 指定要上传的文件的小程序临时文件路径
    //         filePath: this.data.bingxiang.imgList[0],
    //         // 成功回调
    //         success: res => {
    //           console.log('上传成功', res.fileID)
    //           this.setData({
    //             [`bingxiang.imageUrl`]: res.fileID
    //           })

    //           wx.cloud.callFunction({
    //             name: "imageSec_yi",
    //             data: {
    //               imageFileid: this.data.bingxiang.imageUrl
    //             },
    //             success: res => {
    //               console.log(res)

    //               if (res.result.errCode == 87014) {
    //                 wx.hideLoading();
    //                 wx.showModal({
    //                   title: '提醒',
    //                   content: '图片违规',
    //                   //showCancel: false
    //                 })
    //               } else {

    //                 //添加冰箱的资料
    //                 wx.cloud.callFunction({
    //                   name: "bingxiang_add",
    //                   data: this.data.bingxiang,
    //                   success: res => {
    //                     console.log(res)
    //                     wx.hideLoading()
    //                   },
    //                   fail: err => {
    //                     console.log(err)
    //                   },
    //                   complete: () => {
    //                     this.showToast();
    //                   }
    //                 })
    //               }

    //             },
    //             fail: err => {
    //               wx.hideLoading();
    //                 wx.showModal({
    //                   title: '提醒',
    //                   content: '网络异常',
    //                   //showCancel: false
    //                 })
    //             }
    //           })

    //         },

    //       })
    //     } else {
    //       wx.hideLoading();
    //       wx.showModal({
    //         title: '提醒',
    //         content: '用词违规',
    //         //showCancel: false
    //       })

    //     }
    //   })

    // } else {

    //   this.data.bingxiang.imageUrl = "https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/bingxiang/Snipaste_2021-06-25_11-22-11.png?sign=208bc2b2a586e6f2293efd546e1bfc47&t=1624591398"


    //   wx.cloud.callFunction({
    //     name: 'msgsec',
    //     data: {
    //       content: this.data.bingxiang.bx_name + this.data.bingxiang.bx_backup + this.data.bingxiang.bx_location
    //     }
    //   }).then(ckres => {

    //     //写审核通过之后的操作 if == 0
    //     if (ckres.result.errCode == 0) {
    //       wx.cloud.callFunction({
    //         name: "bingxiang_add",
    //         data: this.data.bingxiang,
    //         success: res => {
    //           console.log(res)
    //           wx.hideLoading()
    //         },
    //         fail: err => {
    //           console.log(err)
    //         },
    //         complete: () => {
    //           this.showToast();
    //         }
    //       })
    //     } else {
    //       wx.hideLoading();
    //       wx.showModal({
    //         title: '提醒',
    //         content: '用词违规',
    //         showCancel: false
    //       })

    //     }
    //   })


    // }



  },

  //重置
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail)
    this.setData({
      shiwu: ''
    })
  },





})