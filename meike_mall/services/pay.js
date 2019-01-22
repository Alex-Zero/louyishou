var e = require("../utils/util.js"), n = require("../config/api.js");

getApp();

module.exports = {
    payOrder: function(t) {
        return new Promise(function(i, r) {
            e.request(n.PayPrepayId, {
                orderId: t
            }).then(function(e) {
                if (console.log(e), 0 === e.errno) {
                    var n = e.data;
                    wx.requestPayment({
                        timeStamp: n.timeStamp,
                        nonceStr: n.nonceStr,
                        package: n.package,
                        signType: n.signType,
                        paySign: n.paySign,
                        success: function(e) {
                            i(e);
                        },
                        fail: function(e) {
                            r(e);
                        },
                        complete: function(e) {
                            r(e);
                        }
                    });
                } else r(e);
            });
        });
    }
};