require("../../utils/util.js");

var e = require("../../config/api.js"), t = (require("../../services/pay.js"), getApp());

Page({
    data: {
        status: 0,
        orderInfo: {},
        hbshow: !0,
        orderId: 0
    },
    onLoad: function(e) {
        console.log(e), this.setData({
            orderId: e.orderId,
            status: e.status,
            rap_price: e.rap_price
        }), "0" == e.status && this.getOrderDetail(e.orderId);
    },
    getOrderDetail: function(a) {
        var r = this;
        t.util.request({
            url: e.OrderDetail,
            data: {
                order_sn: a
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || r.setData({
                    orderInfo: e.data.data.orderInfo,
                    orderGoods: e.data.data.orderGoods
                });
            }
        });
    },
    ling: function() {
        this.setData({
            hbshow: !1
        });
    },
    close: function() {
        this.setData({
            hbshow: !0
        });
    },
    save: function() {
        var a = this;
        a.setData({
            hbshow: !0
        });
        var r = a.data.orderId;
        t.util.request({
            url: e.GetRedEnvelope,
            data: {
                order_sn: r
            },
            cachetime: 0,
            success: function(e) {
                console.log("领取成功"), wx.redirectTo({
                    url: "../getred/getred?orderId=" + r
                });
            }
        });
    },
    payOrder: function() {
        var e = this, a = t.siteInfo.siteroot, r = t.siteInfo.uniacid, o = e.data.orderInfo;
        if (console.log(o), a = (a = a.split("/app")[0]) + "/addons/meike_mall/pay" + r + "/example/jsapi.php", 
        e.data.orderGoods.length > 1) s = "商品包裹"; else var s = o.pay_name + "+" + o.pay_attr + "x" + o.pay_num;
        wx.request({
            url: a,
            data: {
                openid: o.openid,
                total: parseFloat(o.actual_price),
                ordersn: o.order_sn,
                title: s
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
                                order_sn: ordersn,
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
                                user_id: user_id,
                                oid: ordersn,
                                openid: openid,
                                nickname: nickname,
                                avatar: avatar,
                                desc: s,
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
});