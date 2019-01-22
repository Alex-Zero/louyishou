require("../../../utils/util.js");

var t = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        currentTabsIndex: 0,
        currentCatId: 0,
        couponList: []
    },
    onLoad: function(t) {
        this.getCouponList();
    },
    catClick: function(t) {
        var e = t.currentTarget.dataset.sid;
        console.log(e), this.setData({
            currentTabsIndex: e
        }), this.getCouponList();
    },
    getCouponList: function() {
        var a = this, s = wx.getStorageSync("userInfo").user_id;
        e.util.request({
            url: t.CouponList,
            data: {
                user_id: s,
                coupon_status: a.data.currentTabsIndex
            },
            cachetime: 0,
            success: function(t) {
                t.data.errno || a.setData({
                    couponList: t.data.data.couponList
                });
            }
        });
    },
    go: function() {
        wx.switchTab({
            url: "/meike_mall/pages/index/index"
        });
    }
});