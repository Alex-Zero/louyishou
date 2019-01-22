require("../../../utils/util.js");

var e = require("../../../config/api.js"), s = getApp();

Page({
    data: {
        orderId: "",
        expressInfo: {},
        expressTraces: []
    },
    onLoad: function(e) {
        console.log(e), this.setData({
            orderId: e.id
        }), this.getExpressInfo();
    },
    onReady: function() {},
    onShow: function() {},
    getExpressInfo: function() {
        var t = this;
        s.util.request({
            url: e.OrderExpress,
            data: {
                orderId: t.data.orderId
            },
            cachetime: 0,
            success: function(r) {
                console.log(r), r.data.errno || t.setData({
                    expressInfo: r.data.data.expressInfo,
                    expressTraces: r.data.data.traces.result.list.reverse()
                }), 1 == r.data.data.traces.result.status && s.util.request({
                    url: e.UpdateExpressStatus,
                    data: {
                        orderId: t.data.orderId
                    },
                    cachetime: 0,
                    success: function(e) {}
                });
            }
        });
    },
    updateExpress: function() {
        this.getExpressInfo();
    },
    onHide: function() {},
    onUnload: function() {}
});