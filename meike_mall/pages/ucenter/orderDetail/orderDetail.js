require("../../../utils/util.js");

var e = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        orderId: 0,
        orderInfo: {},
        orderGoods: [],
        handleOption: {}
    },
    onLoad: function(e) {
        console.log(e), this.setData({
            ordersn: e.order_sn
        }), this.getOrderDetail(e.order_sn);
    },
    getOrderDetail: function(r) {
        var a = this;
        t.util.request({
            url: e.OrderDetail,
            data: {
                order_sn: r
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || a.setData({
                    orderInfo: e.data.data.orderInfo,
                    orderGoods: e.data.data.orderGoods
                });
            }
        });
    },
    buttonClick: function(r) {
        console.log(r);
        var a = this, o = (r.currentTarget.dataset.id, r.currentTarget.dataset.sid), n = r.currentTarget.dataset.pid, s = r.currentTarget.dataset.ordersn, i = wx.getStorageSync("userInfo"), c = i.nickname, d = i.avatar, u = i.user_id, l = i.openid, p = t.siteInfo.uniacid, g = r.currentTarget.dataset.tid + "+" + r.currentTarget.dataset.attr + "x" + r.currentTarget.dataset.num;
        if ("pay" == o) {
            console.log(n);
            var f = t.siteInfo.siteroot;
            f = (f = f.split("/app")[0]) + "/addons/meike_mall/pay" + p + "/example/jsapi.php", 
            wx.request({
                url: f,
                data: {
                    openid: l,
                    total: n,
                    ordersn: s,
                    title: g
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(e) {
                    var r = e.data;
                    r.package.split("=")[1];
                    wx.requestPayment({
                        timeStamp: r.timeStamp,
                        nonceStr: r.nonceStr,
                        package: r.package,
                        signType: "MD5",
                        paySign: r.paySign,
                        success: function(e) {
                            t.util.request({
                                url: "entry/wxapp/OrderPay",
                                data: {
                                    order_sn: s,
                                    order_status: 1
                                },
                                cachetime: 0,
                                success: function(e) {
                                    wx.showToast({
                                        title: "支付成功",
                                        icon: "none",
                                        duration: 2e3
                                    });
                                }
                            }), t.util.request({
                                url: "entry/wxapp/PayLog",
                                data: {
                                    user_id: u,
                                    oid: s,
                                    openid: l,
                                    nickname: c,
                                    avatar: d,
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
        "cancel" == o && wx.showModal({
            content: "确认要取消订单么？",
            confirmColor: "#b4282d",
            success: function(r) {
                if (!r.confirm) return !1;
                t.util.request({
                    url: e.OrderCancel,
                    data: {
                        order_status: "7",
                        order_sn: s
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno || a.getOrderDetail(s);
                    }
                }), t.util.request({
                    url: e.CheckRapOrder,
                    data: {
                        order_sn: s,
                        user_id: u
                    },
                    cachetime: 0,
                    success: function(e) {
                        console.log(e), e.data.errno;
                    }
                });
            }
        }), "express" == o && wx.navigateTo({
            url: "../express/express?id=" + s
        });
    }
});