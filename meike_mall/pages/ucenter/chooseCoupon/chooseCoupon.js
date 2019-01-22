require("../../../utils/util.js");

var t = require("../../../config/api.js"), o = getApp();

Page({
    data: {
        currentTabsIndex: 0,
        currentCatId: 0,
        couponList: [],
        coupon_id: "",
        total: ""
    },
    onLoad: function(t) {
        var o = this, a = wx.getStorageSync("couponInfo").coupon_id;
        console.log(a), o.setData({
            total: parseFloat(t.total),
            coupon_id: a
        }), this.getCouponList();
    },
    catClick: function(t) {
        var o = t.currentTarget.dataset.sid;
        this.setData({
            currentTabsIndex: o
        }), this.getCouponList();
    },
    getCouponList: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        o.util.request({
            url: t.CouponList,
            data: {
                user_id: e,
                coupon_status: a.data.currentTabsIndex
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    couponList: t.data.data.couponList
                });
                for (var o = t.data.data.couponList, e = 0, n = o.length; e < n; ++e) o[e].min_price > a.data.total ? a.setData({
                    use: 0
                }) : a.setData({
                    use: 1
                });
            }
        });
    },
    use: function(t) {
        console.log(t);
        var o = {
            coupon_id: t.currentTarget.dataset.index,
            sub_price: t.currentTarget.dataset.total
        };
        wx.setStorageSync("couponInfo", o), wx.navigateBack({
            delta: 1
        });
    },
    clearuse: function() {
        wx.removeStorage({
            key: "couponInfo",
            success: function(t) {
                console.log("couponInfo已清除");
            }
        }), wx.navigateBack({
            delta: 1
        });
    }
});