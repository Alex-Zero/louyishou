var e = require("../../../utils/util.js"), t = require("../../../config/api.js"), o = getApp();

Page({
    data: {
        userInfo: {},
        sysinfo: {},
        fxset: {},
        qrcode: !0,
        rap: 0,
        windowWidth: "",
        windowHeight: "",
        people: !0,
        agent: !0,
        qr: ""
    },
    setTabBar: function(e) {
        var t = wx.getStorageSync("tabbar"), o = wx.getStorageSync("tabColor");
        this.setData({
            tabbar: t,
            curIdx: e,
            tabColor: o
        });
    },
    onLoad: function(a) {
        var n = this;
        n.setTabBar(a.curIdx), e.login().then(function(e) {
            n.setData({
                code: e.code
            });
        });
        var s = wx.getStorageSync("userInfo").user_id, i = o.siteInfo.uniacid, c = wx.getStorageSync("tabbar");
        n.setData({
            tabbar: c
        }), o.util.request({
            url: t.SharePoster,
            data: {
                user_id: s,
                uniacid: i
            },
            cachetime: 0,
            success: function(e) {
                n.setData({
                    sharePoster: e.data.data.img
                }), wx.getImageInfo({
                    src: e.data.data.img,
                    success: function(e) {
                        n.setData({
                            qr: e.path
                        });
                    }
                });
            }
        }), o.util.request({
            url: t.Index,
            data: {
                user_id: s
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || n.setData({
                    sysinfo: e.data.data.sysinfo,
                    fxset: e.data.data.fxset,
                    rapNumber: e.data.data.rapNumber,
                    assets: e.data.data.assets || "0.00"
                }), wx.getImageInfo({
                    src: e.data.data.sysinfo.poster_image,
                    success: function(e) {
                        n.setData({
                            bg: e.path
                        });
                    }
                });
            }
        });
    },
    onShow: function() {
        var e = this, t = wx.getStorageSync("userInfo"), o = t.phoneNumber || "", a = o.substr(0, 3) + "****" + o.substr(7), n = wx.getSystemInfoSync();
        console.log("---*"+t.ivcode);
        e.setData({
            pixelRatio: n.pixelRatio,
            windowWidth: n.screenWidth,
            windowHeight: n.screenHeight,
            userInfo: t,
            phoneNumber: a
        });
    },
    phoneLimit: function() {
        wx.showToast({
            title: "请先注册/登录",
            icon: "none"
        });
    },
    onPullDownRefresh: function() {
        var e = this, a = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.UserInfo,
            data: {
                user_id: a
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (wx.setStorageSync("userInfo", t.data.data), e.onLoad(), 
                e.onShow());
            }
        }), wx.stopPullDownRefresh();
    },
    applyPeople: function() {
        wx.navigateTo({
            url: "../applyPeople/applyPeople"
        }), this.setData({
            people: !0
        });
    },
    applyStore: function() {
        wx.navigateTo({
            url: "../applyStore/applyStore"
        }), this.setData({
            people: !0
        });
    },
    applyCity: function() {
        wx.navigateTo({
            url: "../applyCity/applyCity"
        }), this.setData({
            people: !0
        });
    },
    applyArea: function() {
        wx.navigateTo({
            url: "../applyArea/applyArea"
        }), this.setData({
            people: !0
        });
    },
    limit: function() {
        wx.showModal({
            title: "提示",
            content: "此功能仅对注册用户开放，请您先进行注册",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(e) {
                e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
            }
        });
    },
    tips: function() {
        wx.showModal({
            title: "提示",
            content: "您的资料正在审核中...",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(e) {
                e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
            }
        });
    },
    upgrade: function () {
      var a = wx.getStorageSync("userInfo"), t = a.user_id, e = a.is_people, o = a.is_store;
      "2" == e ? wx.navigateTo({
        url: "../updatePeople/updatePeople?user_id=" + t
      }) : "2" == o && wx.navigateTo({
        url: "../updateStore/updateStore?user_id=" + t
      });
    },
    qrcode: function() {
        this.setData({
            qrcode: !1
        }), this.drawCanvas();
    },
    close: function() {
        this.setData({
            qrcode: !0
        });
    },
    peopleType: function() {
        this.setData({
            people: !1
        });
    },
    closePeople: function() {
        this.setData({
            people: !0
        });
    },
    agentType: function() {
        this.setData({
            agent: !1
        });
    },
    closeAgent: function() {
        this.setData({
            agent: !0
        });
    },
    errorCity: function() {
        wx.showModal({
            title: "提示",
            content: "您已申请过合伙人，不可再申请城市代理",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(e) {
                e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
            }
        });
    },
    errorPeople: function() {
        wx.showModal({
            title: "提示",
            content: "您已申请过城市代理，不可再申请合伙人",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(e) {
                e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
            }
        });
    },
    drawCanvas: function() {
        console.log("drawCanvas绘制海报");
        var e = this, t = wx.createCanvasContext("myCanvas"), o = .8 * this.data.windowWidth, a = 2 * o, n = this.data.windowWidth / 750, s = t.createLinearGradient(0, 0, 0, a);
        s.addColorStop(0, "#FFFFFF"), s.addColorStop(1, "#FFFFFF"), t.setFillStyle(s), t.fillRect(0, 0, o, a), 
        t.drawImage(this.data.bg, 0, 0, 550 * n, 606 * n), t.drawImage(this.data.qr, 45 * n, 110 * n, 200 * n, 200 * n), 
        t.setFontSize(24 * n), t.setFillStyle("#ffffff"), t.setTextAlign("center"), t.setTextBaseline("middle"), 
        t.fillText(e.data.userInfo.ivcode, 145 * n, 510 * n), t.stroke(), t.draw();
    },
    saveImage: function(e) {
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(e) {
                wx.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function(e) {
                        wx.showToast({
                            title: "图片保存成功",
                            icon: "success",
                            duration: 2e3
                        });
                    }
                });
            }
        });
    },
    getPhoneNumber: function(e) {
        var a = this, n = (e.detail.errMsg, e.detail.iv), s = e.detail.encryptedData, i = a.data.code, c = wx.getStorageSync("session_key"), r = wx.getStorageSync("userInfo").user_id;
        "getPhoneNumber:fail user deny" == e.detail.errMsg ? wx.showToast({
            title: "授权失败请重试",
            icon: "none",
            duration: 2e3
        }) : o.util.request({
            url: t.GetPhoneNumber,
            data: {
                session_key: c,
                encryptedData: s,
                iv: n,
                code: i
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), o.util.request({
                    url: t.UpdatePhoneNumber,
                    data: {
                        phoneNumber: e.data.phoneNumber,
                        user_id: r
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno || wx.setStorageSync("userInfo", e.data.data.userInfo), 
                        "undefined" != e.data.data.userInfo.phoneNumber ? (wx.showToast({
                            title: "授权成功",
                            icon: "none",
                            duration: 2e3
                        }), setTimeout(function() {
                            a.onShow();
                        }, 1e3)) : wx.showToast({
                            title: "签名错误,请关闭小程序重新授权",
                            icon: "none",
                            duration: 2e3
                        });
                    },
                    fail: function(e) {}
                });
            },
            fail: function(e) {
                wx.showModal({
                    title: "提示",
                    content: "签名错误",
                    showCancel: "false",
                    success: function(e) {
                        e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
                    }
                });
            }
        });
    },
    goLogin: function() {
        wx.navigateTo({
            url: "../../auth/index/index"
        });
    }
});