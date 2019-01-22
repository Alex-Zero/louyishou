var e = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        sysinfo: {}
    },
    onLoad: function() {
        var n = this;
        t.util.request({
            url: e.Index,
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || n.setData({
                    sysinfo: e.data.data.sysinfo
                });
            }
        });
    },
    startLogin: function(n) {
        if (console.log(n), "getUserInfo:fail auth deny" == n.detail.errMsg) wx.showToast({
            title: "授权失败请重试",
            icon: "none",
            duration: 2e3
        }); else {
            var a = n.detail.userInfo, o = wx.getStorageSync("userInfo").openid, i = a.nickName, s = a.avatarUrl, c = a.gender, r = a.province, l = a.city, u = a.country;
            t.util.request({
                url: e.InsertUser,
                data: {
                    nickname: i,
                    gender: c,
                    avatarUrl: s,
                    province: r,
                    city: l,
                    country: u,
                    openid: o
                },
                cachetime: 0,
                success: function(e) {
                    console.log(e), wx.setStorageSync("userInfo", e.data.data), console.log("获取授权信息"), 
                    console.log("注册成功，领取新人券"), wx.navigateBack({
                        delta: 1
                    });
                }
            });
        }
    },
    getPhoneNumber: function(e) {
        var n = this, a = t.siteInfo.uniacid, o = (e.detail.errMsg, e.detail.iv), i = e.detail.encryptedData, s = n.data.code, c = t.globalData.session_key, r = t.globalData.userInfo.user_id;
        "getPhoneNumber:fail user deny" == e.detail.errMsg ? wx.showToast({
            title: "授权失败请重试",
            icon: "none",
            duration: 2e3
        }) : t.util.request({
            url: "entry/wxapp/GetPhoneNumber",
            data: {
                session_key: c,
                encryptedData: i,
                iv: o,
                code: s,
                uniacid: a,
                m: "meike_mail"
            },
            cachetime: 0,
            success: function(e) {
                t.util.request({
                    url: "entry/wxapp/Phone",
                    data: {
                        m: "meike_mail",
                        phoneNumber: e.data.phoneNumber,
                        user_id: r
                    },
                    cachetime: 0,
                    success: function(e) {
                        wx.showToast({
                            title: "授权成功",
                            icon: "none",
                            duration: 2e3
                        }), n.onShow();
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
    }
});