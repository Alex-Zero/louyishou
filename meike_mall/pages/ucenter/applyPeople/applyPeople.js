require("../../../utils/util.js");

var e = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        array: [],
        fxset: {},
        level: [],
        index: 0,
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    onShow: function() {
        var t = this, n = wx.getStorageSync("userInfo"), o = n.phoneNumber, i = n.inviter;
        t.setData({
            inviter: i,
            phoneNumber: o
        }), a.util.request({
            url: e.LevelList,
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var a = e.data.data.level[0].money, n = e.data.data.level[0].commission, o = e.data.data.level[0].commission2;
                t.setData({
                    array: e.data.data.levelList,
                    level: e.data.data.level,
                    fxset: e.data.data.fxset,
                    money: a,
                    commission: n,
                    commission2: o
                });
            }
        });
    },
    getPhoneNumber: function(t) {
        var n = this, o = (t.detail.errMsg, t.detail.iv), i = t.detail.encryptedData, s = n.data.code, r = wx.getStorageSync("session_key"), c = wx.getStorageSync("userInfo").user_id;
        "getPhoneNumber:fail user deny" == t.detail.errMsg ? wx.showToast({
            title: "授权失败请重试",
            icon: "none",
            duration: 2e3
        }) : a.util.request({
            url: e.GetPhoneNumber,
            data: {
                session_key: r,
                encryptedData: i,
                iv: o,
                code: s
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), a.util.request({
                    url: e.UpdatePhoneNumber,
                    data: {
                        phoneNumber: t.data.phoneNumber,
                        user_id: c
                    },
                    cachetime: 0,
                    success: function(e) {
                        n.setData({
                            phoneNumber: e.data.data.phoneNumber
                        }), wx.showToast({
                            title: "授权成功",
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
    xieyi: function() {
        wx.navigateTo({
            url: "../shareXieyi/shareXieyi"
        });
    },
    change: function() {
        wx.navigateTo({
            url: "../addInviter/addInviter"
        });
    },
    bindPickerChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        var a = this, t = e.detail.value, n = a.data.level[t].money, o = a.data.level[t].commission, i = a.data.level[t].commission2;
        this.setData({
            index: t,
            money: n,
            commission: o,
            commission2: i
        });
    },
    phoneInput: function(e) {
        var a = this, t = e.detail.value;
        a.setData({
            phoneNumber: t
        });
    },
    owner: function(e) {
        var a = this, t = e.detail.value;
        a.setData({
            owner: t
        });
    },
    removeOwner: function(e) {
        this.setData({
            owner: ""
        });
    },
    formSubmit: function(t) {
        var n = this, o = wx.getStorageSync("userInfo"), i = o.user_id, s = o.nickname, r = o.avatar, c = o.openid, l = o.city, u = n.data.index, d = n.data.array[u], m = n.data.money, p = t.detail.formId, f = t.detail.value.owner, h = t.detail.value.phoneNumber;
        return "" == f ? (a.showErrorModal("请输入真实姓名", "提醒"), !1) : "" == h ? (a.showErrorModal("请获取手机号", "提醒"), 
        !1) : void a.util.request({
            url: e.ApplyShare,
            data: {
                user_id: i,
                openid: c,
                level: parseInt(u) + parseInt(1),
                owner: f,
                mobile: h,
                form_id: p,
                nickname: s,
                avatar: r,
                total: m,
                city: l,
                status: "0",
                pay_status: "0"
            },
            cachetime: 0,
            success: function(t) {
                if (!t.data.errno) {
                    var o = t.data.data.ordersn, l = a.siteInfo.siteroot, u = a.siteInfo.uniacid, p = "开通" + d + "合伙人";
                    l = (l = l.split("/app")[0]) + "/addons/meike_mall/pay" + u + "/example/jsapi.php", 
                    console.log(l), wx.request({
                        url: l,
                        data: {
                            openid: c,
                            total: m,
                            ordersn: o,
                            title: p
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(t) {
                            var l = t.data, u = l.package.split("=")[1];
                            wx.requestPayment({
                                timeStamp: l.timeStamp,
                                nonceStr: l.nonceStr,
                                package: l.package,
                                signType: "MD5",
                                paySign: l.paySign,
                                success: function(t) {
                                    n.sendMessage(u, c, o, p, m), a.util.request({
                                        url: "entry/wxapp/ShareOrderStatus",
                                        data: {
                                            user_id: i,
                                            ordersn: o,
                                            pay_status: "1"
                                        },
                                        cachetime: 0,
                                        success: function(t) {
                                            console.log(n.data.fxset.audit), 1 == n.data.fxset.audit && a.util.request({
                                                url: e.AutoApplyPeople,
                                                data: {
                                                    ordersn: o,
                                                    user_id: i
                                                },
                                                cachetime: 0,
                                                success: function(e) {}
                                            }), wx.setStorageSync("userInfo", t.data.data);
                                        }
                                    }), a.util.request({
                                        url: "entry/wxapp/PayLog",
                                        data: {
                                            user_id: i,
                                            oid: o,
                                            openid: c,
                                            nickname: s,
                                            avatar: r,
                                            desc: p,
                                            total: m
                                        },
                                        cachetime: 0,
                                        success: function(e) {}
                                    }), wx.showModal({
                                        title: "通知",
                                        content: "您的资料已提交成功，系统正在审核，请留意审核结果通知。",
                                        showCancel: !1,
                                        confirmText: "我知道了",
                                        success: function(e) {
                                            e.confirm ? (console.log("用户点击确定"), wx.navigateBack({
                                                delta: 1
                                            })) : e.cancel && console.log("用户点击取消");
                                        }
                                    });
                                },
                                fail: function(e) {
                                    a.util.request({
                                        url: "entry/wxapp/DelShareOrder",
                                        data: {
                                            user_id: i,
                                            ordersn: o
                                        },
                                        cachetime: 0,
                                        success: function(e) {
                                            console.log("订单已删除");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    sendMessage: function(e, t, n, o, i) {
        a.util.request({
            url: "entry/wxapp/SendMessageApply",
            data: {
                pack: e,
                openid: t,
                ordersn: n,
                title: o,
                total: i
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno;
            },
            fail: function(e) {
                console.log(e);
            }
        });
    }
});