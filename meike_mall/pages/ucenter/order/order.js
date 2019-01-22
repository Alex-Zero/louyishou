require("../../../utils/util.js");

var e = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        list: [],
        sysinfo: {},
        currentTabsIndex: 10,
        currentCatId: 0,
        reasonList: [ {
            name: "买多了/买错了"
        }, {
            name: "信息填写错误，重新拍"
        }, {
            name: "联系不上商家"
        }, {
            name: "其他原因"
        } ],
        reason: !0,
        orderList: []
    },
    onLoad: function(a) {
        console.log(a);
        var r = this, s = a.id || "10";
        this.setData({
            currentTabsIndex: s
        }), this.getOrderList(s);
        var n = wx.getSystemInfoSync();
        this.setData({
            pixelRatio: n.pixelRatio,
            windowWidth: n.screenWidth,
            windowHeight: n.screenHeight
        }), t.util.request({
            url: e.Index,
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || r.setData({
                    sysinfo: e.data.data.sysinfo
                });
            }
        });
    },
    catClick: function(e) {
        var t = e.currentTarget.dataset.sid;
        this.setData({
            currentTabsIndex: t
        }), this.getOrderList(t);
    },
    getOrderList: function(a) {
        var r = this, s = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: e.OrderList,
            data: {
                user_id: s,
                order_status: a
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || r.setData({
                    orderList: e.data.data
                });
            }
        });
    },
    buttonClick: function(a) {
        console.log(a);
        a.currentTarget.dataset.id;
        var r = a.currentTarget.dataset.sid, s = a.currentTarget.dataset.pid, n = a.currentTarget.dataset.ordersn, o = wx.getStorageSync("userInfo"), i = o.nickname, c = o.avatar, d = o.user_id, u = o.openid, l = t.siteInfo.uniacid, g = a.currentTarget.dataset.tid + "+" + a.currentTarget.dataset.attr + "x" + a.currentTarget.dataset.num, f = this;
        if ("pay" == r) {
            console.log(s);
            var p = t.siteInfo.siteroot;
            p = (p = p.split("/app")[0]) + "/addons/meike_mall/pay" + l + "/example/jsapi.php", 
            wx.request({
                url: p,
                data: {
                    openid: u,
                    total: s,
                    ordersn: n,
                    title: g
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(e) {
                    var a = e.data;
                    a.package.split("=")[1];
                    wx.requestPayment({
                        timeStamp: a.timeStamp,
                        nonceStr: a.nonceStr,
                        package: a.package,
                        signType: "MD5",
                        paySign: a.paySign,
                        success: function(e) {
                            t.util.request({
                                url: "entry/wxapp/OrderPay",
                                data: {
                                    order_sn: n,
                                    order_status: 1
                                },
                                cachetime: 0,
                                success: function(e) {
                                    wx.showToast({
                                        title: "支付成功",
                                        icon: "none",
                                        duration: 2e3
                                    }), f.getOrderList(10);
                                }
                            }), t.util.request({
                                url: "entry/wxapp/PayLog",
                                data: {
                                    user_id: d,
                                    oid: n,
                                    openid: u,
                                    nickname: i,
                                    avatar: c,
                                    desc: g,
                                    total: order_total
                                },
                                cachetime: 0,
                                success: function(e) {}
                            });
                        },
                        fail: function(e) {
                            wx.showToast({
                                title: "支付失败请重试",
                                icon: "none",
                                duration: 2e3
                            });
                        }
                    });
                }
            });
        }
        "cancel" == r && wx.showModal({
            content: "确认要取消订单么？",
            confirmColor: "#b4282d",
            success: function(a) {
                if (!a.confirm) return !1;
                t.util.request({
                    url: e.OrderCancel,
                    data: {
                        order_status: "7",
                        order_sn: n
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno || (f.getOrderList(10), f.setData({
                            currentTabsIndex: 10
                        }));
                    }
                }), t.util.request({
                    url: e.CheckRapOrder,
                    data: {
                        order_sn: n,
                        user_id: d
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno;
                    }
                });
            }
        }), "express" == r && wx.navigateTo({
            url: "../express/express?id=" + n
        }), "confirm" == r && t.util.request({
            url: e.OrderConfirm,
            data: {
                order_status: "3",
                order_sn: n
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || (wx.showToast({
                    title: "收货成功",
                    icon: "none"
                }), f.getOrderList(10), f.setData({
                    currentTabsIndex: 10
                }));
            }
        }), "refund" == r && (wx.setStorageSync("ordersn", n), this.setData({
            reason: !1
        }));
    },
    cancel: function() {
        this.setData({
            reason: !0
        });
    },
    radioChange: function(e) {
        console.log(e), this.setData({
            value: e.detail.value
        });
    },
    confirm: function() {
        var a = this, r = a.data.value, s = a.data.reasonList[r].name, n = wx.getStorageSync("ordersn");
        t.util.request({
            url: e.OrderRefund,
            data: {
                order_status: "4",
                order_sn: n,
                mark: s
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || (a.getOrderList(10), a.setData({
                    currentTabsIndex: 10,
                    reason: !0
                }));
            }
        });
    }
});