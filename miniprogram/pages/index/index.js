const app = getApp()

var ctx = null, // 创建canvas对象
  canvasToTempFilePath = null, // 保存最终生成的导出的图片地址
  openStatus = true; // 声明一个全局变量判断是否授权保存到相册

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,

    //冰箱列表
    bingxiangList: [],

    //用户授权
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,

    //加入的冰箱列表
    bingxiangShareList: [],

    //当前用户的openid
    CurrentOpenId: '',

    //轮播图
    lunbotuList: [{
      id: 0,
      type: 'image',
      url: 'https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/lunbotu/50bc05ba1e6f1713cfa6453319cc2331.jpeg?sign=b30f2df1fa9ad668d9a3c01e5d5f30e5&t=1627018161'
    }, {
      id: 1,
      type: 'image',
      url: 'https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/lunbotu/Snipaste_2021-05-22_19-12-45.png?sign=0c45d6ae152b1455bf661b06b2cceb6b&t=1627018227',
    }, {
      id: 2,
      type: 'image',
      url: 'https://636c-cloud1-5gcq2esd47d7b251-1305999303.tcb.qcloud.la/lunbotu/Snipaste_2021-05-22_19-13-09.png?sign=c5ca14ae8a72555588c1ee2bccbee00f&t=1627018248'
    }],

    //海报分享
    canvasToTempFilePath: '',
    openStatus: true,
    show: false,

    //海报数据
    guoqilv: '', //过期率
    jujiazhishu: '', //居家指数
    avgTime: '', //平均录入时间
    zongshu: '', //总数

  

  },

  //过期率
  getGuoQiLv() {

    wx.cloud.callFunction({
      name: "guoqilv",
      success: res => {
        console.log(res.result.toFixed(1))
        this.setData({
          guoqilv: res.result.toFixed(1)
        })
      }
    })

  },

  //平均录入时间
  getAvgTime() {

    wx.cloud.callFunction({
      name: "pingjun_time",
      success: res => {
        console.log((0.001 * (res.result.list[0].avgTime)).toFixed(1))
        this.setData({
          avgTime: (0.001 * (res.result.list[0].avgTime)).toFixed(1)
        })
      }
    })


  },

  //食物总数
  getZongshu() {

    wx.cloud.callFunction({
      name: "add_zongshu",
      success: res => {
        console.log(res.result)
        this.setData({
          zongshu: res.result
        })
      }
    })
  },



  // 海报分享
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },


  // 生成海报
  async createCanvasImage() {

    let that = this


    if (app.globalData.userInfo['nickName'] == "微信用户") {

      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = res.userInfo


          //保存用户信息
          wx.cloud.callFunction({
            name: "user_add",
            data: {
              userData: res.userInfo
            },
            success: res => {
              console.log(res)
              console.log("保存用户信息")
            }
          })

          wx.setStorageSync("userInfo", res.userInfo)

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })

          if (!ctx) {
            wx.showLoading({
              title: '绘制中...'
            })

            //小程序码
            let code = new Promise(function (resolve, reject) {
              resolve("../../images/xcxm.jpg")
            }).catch(res => {
              console.log('catch', res)
            });

            // 头像
            let headImg = new Promise(function (resolve, reject) {
              resolve("../../images/jxtx.png")
            }).catch(res => {
              console.log('catch', res)
            });

            Promise.all([headImg, code]).then(function (result) {
              const ctx = wx.createCanvasContext('myCanvas')
              //console.log(ctx, app.globalData.ratio, 'ctx')

              const dpr = wx.getSystemInfoSync().pixelRatio


              let canvasWidthPx = 690 * dpr,
                canvasHeightPx = 1085 * dpr,
                avatarurl_width = 75, //绘制的头像宽度
                avatarurl_heigth = 75, //绘制的头像高度
                avatarurl_x = 92, //绘制的头像在画布上的位置
                avatarurl_y = 23, //绘制的头像在画布上的位置
                codeurl_width = 100, //绘制的二维码宽度
                codeurl_heigth = 100, //绘制的二维码高度
                codeurl_x = 521, //绘制的二维码在画布上的位置
                codeurl_y = 961, //绘制的二维码在画布上的位置
                wordNumber = that.data.zongshu,
                allReading = 97 / 6 / dpr * wordNumber.toString().length + 325;
              console.log(wordNumber, wordNumber.toString().length, allReading, '获取总阅读字数的宽度')
              ctx.drawImage('../../images/01158.png', 0, 0, 690, 1085)

              ctx.save(); // 先保存状态 已便于画完圆再用
              ctx.beginPath(); //开始绘制
              //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
              ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
              ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
              ctx.drawImage(result[0], avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片

              ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
              ctx.setFillStyle('#000000'); // 文字颜色
              ctx.setFontSize(28); // 文字字号

              ctx.fillText(app.globalData.userInfo.nickName, 168, 68);


              ctx.font = '22rpx Arial';
              ctx.setFillStyle('#000000'); // 文字颜色
              ctx.fillText(wordNumber, 280, 334); // 绘制文字


              ctx.font = '24rpx Arial';
              ctx.setFillStyle('#333333'); // 文字颜色
              ctx.fillText(that.data.guoqilv, 541, 462);
              ctx.fillText((100 - that.data.guoqilv / 2 - that.data.avgTime / 5).toFixed(1), 543, 585);
              ctx.fillText(that.data.avgTime + "s", 538, 725);


              ctx.drawImage(result[1], codeurl_x, codeurl_y, codeurl_width, codeurl_heigth); // 绘制头像

              ctx.draw(false, function () {
                // canvas画布转成图片并返回图片地址


                wx.canvasToTempFilePath({
                  canvasId: 'myCanvas',
                  success: function (res) {
                    canvasToTempFilePath = res.tempFilePath
                    that.setData({
                      showShareImg: true,
                      canvasToTempFilePath: res.tempFilePath //我自己添加的
                    })
                    console.log(res.tempFilePath, 'canvasToTempFilePath')
                    wx.showToast({
                      title: '绘制成功',
                    })
                  },
                  fail: function () {
                    wx.showToast({
                      title: '绘制失败',
                    })
                  },
                  complete: function () {
                    wx.hideLoading()
                    wx.hideToast()
                  }
                })


              })
              that.setData({
                show: true
              })
            })
          }

        }
      })

    } else {

      if (!ctx) {
        wx.showLoading({
          title: '绘制中...'
        })

        //小程序码
        let code = new Promise(function (resolve, reject) {
          resolve("../../images/xcxm.jpg")
        }).catch(res => {
          console.log('catch', res)
        });

        // 头像
        let headImg = new Promise(function (resolve, reject) {
          resolve("../../images/jxtx.png")
        }).catch(res => {
          console.log('catch', res)
        });

        Promise.all([headImg, code]).then(function (result) {
          const ctx = wx.createCanvasContext('myCanvas')
          //console.log(ctx, app.globalData.ratio, 'ctx')

          const dpr = wx.getSystemInfoSync().pixelRatio


          let canvasWidthPx = 690 * dpr,
            canvasHeightPx = 1085 * dpr,
            avatarurl_width = 75, //绘制的头像宽度
            avatarurl_heigth = 75, //绘制的头像高度
            avatarurl_x = 92, //绘制的头像在画布上的位置
            avatarurl_y = 23, //绘制的头像在画布上的位置
            codeurl_width = 100, //绘制的二维码宽度
            codeurl_heigth = 100, //绘制的二维码高度
            codeurl_x = 521, //绘制的二维码在画布上的位置
            codeurl_y = 961, //绘制的二维码在画布上的位置
            wordNumber = that.data.zongshu,
            allReading = 97 / 6 / dpr * wordNumber.toString().length + 325;
          console.log(wordNumber, wordNumber.toString().length, allReading, '获取总阅读字数的宽度')
          ctx.drawImage('../../images/01158.png', 0, 0, 690, 1085)

          ctx.save(); // 先保存状态 已便于画完圆再用
          ctx.beginPath(); //开始绘制
          //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
          ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
          ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
          ctx.drawImage(result[0], avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片

          ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
          ctx.setFillStyle('#000000'); // 文字颜色
          ctx.setFontSize(28); // 文字字号

          ctx.fillText(app.globalData.userInfo.nickName, 168, 68);


          ctx.font = '22rpx Arial';
          ctx.setFillStyle('#000000'); // 文字颜色
          ctx.fillText(wordNumber, 280, 334); // 绘制文字


          ctx.font = '24rpx Arial';
          ctx.setFillStyle('#333333'); // 文字颜色
          ctx.fillText(that.data.guoqilv, 541, 462);
          ctx.fillText((100 - that.data.guoqilv / 2 - that.data.avgTime / 5).toFixed(1), 543, 585);
          ctx.fillText(that.data.avgTime + "s", 538, 725);


          ctx.drawImage(result[1], codeurl_x, codeurl_y, codeurl_width, codeurl_heigth); // 绘制头像

          ctx.draw(false, function () {
            // canvas画布转成图片并返回图片地址
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: function (res) {
                canvasToTempFilePath = res.tempFilePath
                that.setData({
                  showShareImg: true,
                  canvasToTempFilePath: res.tempFilePath //我自己添加的
                })
                console.log(res.tempFilePath, 'canvasToTempFilePath')
                wx.showToast({
                  title: '绘制成功',
                })
              },
              fail: function () {
                wx.showToast({
                  title: '绘制失败',
                })
              },
              complete: function () {
                wx.hideLoading()
                wx.hideToast()
              }
            })


          })
          that.setData({
            show: true
          })
        })
      }




    }






    // if (!ctx) {
    //   wx.showLoading({
    //     title: '绘制中...'
    //   })

    //   //小程序码
    //   let code = new Promise(function (resolve, reject) {
    //     resolve("../../images/xcxm.jpg")
    //   }).catch(res => {
    //     console.log('catch', res)
    //   });

    //   // 头像
    //   let headImg = new Promise(function (resolve, reject) {
    //     resolve("../../images/jxtx.png")
    //   }).catch(res => {
    //     console.log('catch', res)
    //   });

    //   Promise.all([headImg, code]).then(function (result) {
    //     const ctx = wx.createCanvasContext('myCanvas')
    //     //console.log(ctx, app.globalData.ratio, 'ctx')

    //     const dpr = wx.getSystemInfoSync().pixelRatio


    //     console.log("11111111")

    //     let canvasWidthPx = 690 * dpr,
    //       canvasHeightPx = 1085 * dpr,
    //       avatarurl_width = 75, //绘制的头像宽度
    //       avatarurl_heigth = 75, //绘制的头像高度
    //       avatarurl_x = 92, //绘制的头像在画布上的位置
    //       avatarurl_y = 23, //绘制的头像在画布上的位置
    //       codeurl_width = 100, //绘制的二维码宽度
    //       codeurl_heigth = 100, //绘制的二维码高度
    //       codeurl_x = 521, //绘制的二维码在画布上的位置
    //       codeurl_y = 961, //绘制的二维码在画布上的位置
    //       wordNumber = that.data.zongshu,
    //       allReading = 97 / 6 / dpr * wordNumber.toString().length + 325;
    //     console.log(wordNumber, wordNumber.toString().length, allReading, '获取总阅读字数的宽度')
    //     ctx.drawImage('../../images/01158.png', 0, 0, 690, 1085)

    //     ctx.save(); // 先保存状态 已便于画完圆再用
    //     ctx.beginPath(); //开始绘制
    //     //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    //     ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    //     ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    //     ctx.drawImage(result[0], avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片

    //     console.log(result[0])
    //     console.log("5656565656")


    //     ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    //     ctx.setFillStyle('#000000'); // 文字颜色
    //     ctx.setFontSize(28); // 文字字号

    //     ctx.fillText(app.globalData.userInfo.nickName, 168, 68);


    //     ctx.font = '22rpx Arial';
    //     ctx.setFillStyle('#000000'); // 文字颜色
    //     ctx.fillText(wordNumber, 280, 334); // 绘制文字


    //     ctx.font = '24rpx Arial';
    //     ctx.setFillStyle('#333333'); // 文字颜色
    //     ctx.fillText(that.data.guoqilv, 541, 462);
    //     ctx.fillText((100-that.data.guoqilv/2-that.data.avgTime/5).toFixed(1), 543, 585);
    //     ctx.fillText(that.data.avgTime + "s", 538, 725);


    //     ctx.drawImage(result[1], codeurl_x, codeurl_y, codeurl_width, codeurl_heigth); // 绘制头像

    //     ctx.draw(false, function () {
    //       // canvas画布转成图片并返回图片地址
    //       wx.canvasToTempFilePath({
    //         canvasId: 'myCanvas',
    //         success: function (res) {
    //           canvasToTempFilePath = res.tempFilePath
    //           that.setData({
    //             showShareImg: true,
    //             canvasToTempFilePath: res.tempFilePath //我自己添加的
    //           })
    //           console.log(res.tempFilePath, 'canvasToTempFilePath')
    //           wx.showToast({
    //             title: '绘制成功',
    //           })
    //         },
    //         fail: function () {
    //           wx.showToast({
    //             title: '绘制失败',
    //           })
    //         },
    //         complete: function () {
    //           wx.hideLoading()
    //           wx.hideToast()
    //         }
    //       })


    //     })
    //     that.setData({
    //       show: true
    //     })
    //   })
    // }


  },

  // 保存到系统相册
  saveShareImg: function () {
    let that = this;
    // 数据埋点点击保存学情海报
    that.setData({
      saveId: '保存学情海报'
    })

    console.log(canvasToTempFilePath)

    // 获取用户是否开启用户授权相册
    if (!openStatus) {
      wx.openSetting({
        success: (result) => {
          if (result) {
            if (result.authSetting["scope.writePhotosAlbum"] === true) {
              openStatus = true;
              wx.saveImageToPhotosAlbum({
                filePath: canvasToTempFilePath,
                success() {
                  that.setData({
                    showShareImg: false
                  })
                  wx.showToast({
                    title: '图片保存成功，快去分享到朋友圈吧~',
                    icon: 'none',
                    duration: 2000
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        },
        fail: () => {},
        complete: () => {}
      });
    } else {
      wx.getSetting({
        success(res) {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                openStatus = true
                wx.saveImageToPhotosAlbum({
                  filePath: canvasToTempFilePath,
                  success() {
                    that.setData({
                      showShareImg: false
                    })
                    wx.showToast({
                      title: '图片保存成功，快去分享到朋友圈吧~',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail() {
                // 如果用户拒绝过或没有授权，则再次打开授权窗口
                openStatus = false
                console.log('请设置允许访问相册')
                wx.showToast({
                  title: '请设置允许访问相册',
                  icon: 'none'
                })
              }
            })
          } else {
            // 有则直接保存
            openStatus = true
            wx.saveImageToPhotosAlbum({
              filePath: canvasToTempFilePath,
              success() {
                that.setData({
                  showShareImg: false
                })
                wx.showToast({
                  title: '图片保存成功，快去分享到朋友圈吧~',
                  icon: 'none',
                  duration: 2000
                })
              },
              fail() {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },



  onCloseH(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },


  //获取冰箱列表
  getBingxiangList() {

    wx.cloud.callFunction({
      name: "bingxiang_list",
      success: res => {
        console.log(res)
        this.setData({
          bingxiangList: res.result
        })
      }
    })
  },


  //获取冰箱列表
  getBingxiangShareList() {

    wx.cloud.callFunction({
      name: "bingxiang_list_share",
      success: res => {
        console.log(res.result)
        this.setData({
          bingxiangShareList: res.result
        })
      }
    })

  },

  // //获取轮播图
  // getLunbotuList() {

  //   var lbtlist = []

  //   wx.cloud.callFunction({
  //     name: "lunbotu_list",
  //     success: res => {

  //       for (let i = 0; i < res.result.data.length; i++) {
  //         let yizhang = {};
  //         yizhang.id = i + 1;
  //         yizhang.type = 'image';
  //         yizhang.url = res.result.data[i].imageurl;
  //         lbtlist.push(yizhang)
  //         console.log(yizhang)
  //       }
  //     },
  //     complete: () => {
  //       this.setData({
  //         lunbotuList: lbtlist
  //       })
  //       console.log(lbtlist)
  //     }
  //   })



  // },

  //跳到添加冰箱的页面，并且要用户授权
  turnToAddBx() {

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

          //保存用户信息
          wx.cloud.callFunction({
            name: "user_add",
            data: {
              userData: res.userInfo
            },
            success: res => {
              console.log(res)
              console.log("保存用户信息")
            }
          })

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })

          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/bx-add/bx-add',
            })
          }, 200)
        }
      })

    } else {
      wx.navigateTo({
        url: "/pages/bx-add/bx-add"
      })
    }


    //打印
    console.log(app.globalData.userInfo.avatarUrl)

  },

  //跳转到冰箱页面
  trunToBingxiang(e) {

    console.log(e)

    let idd = e.currentTarget.dataset.item._id
    let bx_name = e.currentTarget.dataset.item.bx_name
    let bx_location = e.currentTarget.dataset.item.bx_location
    let imageUrl = e.currentTarget.dataset.item.imageUrl
    let shareNum = e.currentTarget.dataset.item.shareList.length


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

          //保存用户信息
          wx.cloud.callFunction({
            name: "user_add",
            data: {
              userData: res.userInfo
            },
            success: res => {
              console.log(res)
              console.log("保存用户信息")
            }
          })

          wx.showToast({
            title: "授权成功",
            icon: "success"
          })

          wx.navigateTo({
            url: '/pages/bingxiang/bingxiang?idd=' + idd + '&bx_name=' + bx_name + '&bx_location=' + bx_location + '&imageUrl=' + imageUrl + '&CurrentOpenId=' + this.data.CurrentOpenId + '&shareNum=' + shareNum,
          })
        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/bingxiang/bingxiang?idd=' + idd + '&bx_name=' + bx_name + '&bx_location=' + bx_location + '&imageUrl=' + imageUrl + '&shareNum=' + shareNum,
      })
    }


  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },


  //删除冰箱
  shanchuBX(e) {
    let bxidd = e.currentTarget.dataset.bxidd;
    let bxname = e.currentTarget.dataset.bxname;

    let canshu = {};
    canshu.bxidd = bxidd;

    wx.showModal({
      title: '提示',
      content: "确定要删除'" + bxname + "'？",
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "bingxiang_delete",
            data: canshu,
            success: res => {
              this.getBingxiangList()
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


  //取消冰箱
  quxiaoBX(e) {
    let bxidd = e.currentTarget.dataset.bxidd;
    let bxname = e.currentTarget.dataset.bxname;

    let canshu = {};
    canshu.bxidd = bxidd;
    canshu.nickName = app.globalData.userInfo.nickName

    wx.showModal({
      title: '提示',
      content: "确定取消'" + bxname + "'？",
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "bingxiang_delete_share",
            data: canshu,
            success: res => {
              this.getBingxiangShareList()
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBingxiangList();

    this.getBingxiangShareList();

    //微信授权
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    //获取当前用户id
    this.getCurrentOpenId();

    this.getZongshu()
    this.getAvgTime()
    this.getGuoQiLv()

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

    // //获取轮播图列表
    // this.getLunbotuList()

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})