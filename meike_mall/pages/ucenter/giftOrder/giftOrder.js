require("../../../utils/util.js");

var e = require("../../../config/api.js"), r = getApp();

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
    getOrderDetail: function(t) {
        var o = this;
        r.util.request({
            url: e.GiftOrderDetail,
            data: {
                order_sn: t
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || o.setData({
                    orderInfo: e.data.data
                });
            }
        });
    },
    buttonClick: function(t) {
        console.log(t);
        var o = this, a = t.currentTarget.dataset.sid, s = t.currentTarget.dataset.ordersn;
        "confirm" == a && r.util.request({
            url: e.ConfirmGiftOrder,
            data: {
                order_sn: s
            },
            cachetime: 0,
            success: function(e) {
                console.log("签收成功"), o.getOrderDetail(s);
            }
        });
    }
});