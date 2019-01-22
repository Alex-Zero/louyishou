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
        var t = this, n = wx.getStorageSync("userInfo").inviter;
        t.setData({
            inviter: n
        }), a.util.request({
            url: e.LevelList,
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var a = e.data.data.level[0].money, n = e.data.data.level[0].commission, i = e.data.data.level[0].commission2;
                t.setData({
                    array: e.data.data.levelList,
                    level: e.data.data.level,
                    fxset: e.data.data.fxset,
                    money: a,
                    commission: n,
                    commission2: i
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
        var a = this, t = e.detail.value, n = a.data.level[t].money, i = a.data.level[t].commission, o = a.data.level[t].commission2;
        this.setData({
            index: t,
            money: n,
            commission: i,
            commission2: o
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
        var n = this, i = wx.getStorageSync("userInfo"), o = i.user_id, s = i.nickname, r = i.avatar, c = i.openid, l = i.city, d = n.data.index, u = n.data.array[d], m = n.data.money, p = t.detail.formId, v = t.detail.value.owner, f = t.detail.value.phoneNumber;
        return "" == v ? (a.showErrorModal("请输入真实姓名", "提醒"), !1) : "" == f ? (a.showErrorModal("请输入手机号", "提醒"), 
        !1) : void a.util.request({
            url: e.ApplyShare,
            data: {
                user_id: o,
                openid: c,
                level: d + 1,
                owner: v,
                mobile: f,
                form_id: p,
                nickname: s,
                avatar: r,
                total: m,
                city: l,
                status: "0",
                pay_status: "0"
            },
            cachetime: 0,
            success: function(e) {
                if (!e.data.errno) {
                    var t = e.data.data.ordersn, i = a.siteInfo.siteroot, l = a.siteInfo.uniacid, d = "开通" + u + "合伙人";
                    i = (i = i.split("/app")[0]) + "/addons/meike_mall/pay" + l + "/example/jsapi.php", 
                    console.log(i), wx.request({
                        url: i,
                        data: {
                            openid: c,
                            total: m,
                            ordersn: t,
                            title: d
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(e) {
                            var i = e.data, l = i.package.split("=")[1];
                            wx.requestPayment({
                                timeStamp: i.timeStamp,
                                nonceStr: i.nonceStr,
                                package: i.package,
                                signType: "MD5",
                                paySign: i.paySign,
                                success: function(e) {
                                    n.sendMessage(l, c, t, d, m), a.util.request({
                                        url: "entry/wxapp/ShareOrderStatus",
                                        data: {
                                            user_id: o,
                                            ordersn: t,
                                            pay_status: "1"
                                        },
                                        cachetime: 0,
                                        success: function(e) {
                                            wx.setStorageSync("userInfo", e.data.data);
                                        }
                                    }), a.util.request({
                                        url: "entry/wxapp/PayLog",
                                        data: {
                                            user_id: o,
                                            oid: t,
                                            openid: c,
                                            nickname: s,
                                            avatar: r,
                                            desc: d,
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
                                            user_id: o,
                                            ordersn: t
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
    sendMessage: function(e, t, n, i, o) {
        a.util.request({
            url: "entry/wxapp/SendMessageApply",
            data: {
                pack: e,
                openid: t,
                ordersn: n,
                title: i,
                total: o
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