require("../../../utils/util.js");

var e = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        partnerInfo: {},
        array: [],
        level: [],
        index: 0,
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    xieyi: function() {
        wx.navigateTo({
            url: "../shareXieyi/shareXieyi"
        });
    },
    bindPickerChange: function(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        var a = this, t = e.detail.value, o = a.data.level[t].money, n = a.data.level[t].commission, i = a.data.level[t].commission2, s = a.data.partnerInfo.num - 1, l = a.data.level[s].money, r = parseFloat(o - l).toFixed(2);
        console.log(r), this.setData({
            index: t,
            money: o,
            oldLevel: s,
            commission: n,
            updataMoney: r,
            commission2: i
        });
    },
    formSubmit: function(t) {
        var o = this, n = wx.getStorageSync("userInfo"), i = n.user_id, s = n.nickname, l = n.avatar, r = o.data.index, c = o.data.array[r], d = o.data.updataMoney, u = (t.detail.formId, 
        "升级为" + c + "合伙人");
        if (this.data.partnerInfo.num > r) return a.showErrorModal("请高于当前等级", "提醒"), !1;
        a.util.request({
            url: e.UpdatePeople,
            data: {
                user_id: i,
                oldLevel: parseFloat(o.data.oldLevel) + 1,
                level: parseFloat(r) + parseFloat(1),
                total: d,
                title: u
            },
            cachetime: 0,
            success: function(t) {
                if (console.log(t), !t.data.errno) {
                    var o = t.data.data.order_sn, n = wx.getStorageSync("userInfo").openid, m = a.siteInfo.siteroot, p = a.siteInfo.uniacid;
                    m = (m = m.split("/app")[0]) + "/addons/meike_mall/pay" + p + "/example/jsapi.php", 
                    console.log(m), wx.request({
                        url: m,
                        data: {
                            openid: n,
                            total: d,
                            ordersn: o,
                            title: u
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(t) {
                            var m = t.data;
                            m.package.split("=")[1];
                            wx.requestPayment({
                                timeStamp: m.timeStamp,
                                nonceStr: m.nonceStr,
                                package: m.package,
                                signType: "MD5",
                                paySign: m.paySign,
                                success: function(t) {
                                    a.util.request({
                                        url: e.UpdatePeoplePay,
                                        data: {
                                            order_sn: o,
                                            level: parseFloat(r) + 1,
                                            user_id: i
                                        },
                                        cachetime: 0,
                                        success: function(e) {
                                            wx.showModal({
                                                title: "通知",
                                                content: "恭喜您，升级成功。尊享" + c + "权益",
                                                showCancel: !1,
                                                confirmText: "我知道了",
                                                success: function(e) {
                                                    e.confirm ? (console.log("用户点击确定"), wx.navigateBack({
                                                        delta: 1
                                                    })) : e.cancel && console.log("用户点击取消");
                                                }
                                            });
                                        }
                                    }), a.util.request({
                                        url: e.PayLog,
                                        data: {
                                            user_id: i,
                                            oid: o,
                                            openid: n,
                                            nickname: s,
                                            avatar: l,
                                            desc: u,
                                            total: d
                                        },
                                        cachetime: 0,
                                        success: function(e) {}
                                    });
                                },
                                fail: function(e) {
                                    wx.showToast({
                                        title: "升级失败，请重试",
                                        icon: "none"
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    onLoad: function(t) {
        var o = this, n = wx.getStorageSync("userInfo"), i = n.user_id, s = n.inviter;
        o.setData({
            inviter: s
        }), a.util.request({
            url: e.LevelList,
            cachetime: 0,
            success: function(e) {
                console.log(e);
                var a = e.data.data.level[0].money, t = e.data.data.level[0].commission, n = e.data.data.level[0].commission2;
                o.setData({
                    array: e.data.data.levelList,
                    level: e.data.data.level,
                    fxset: e.data.data.fxset,
                    money: a,
                    commission: t,
                    updataMoney: "0.00",
                    commission2: n
                });
            }
        }), a.util.request({
            url: e.Partner,
            data: {
                user_id: i
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), o.setData({
                    partnerInfo: e.data.data.partnerInfo
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});