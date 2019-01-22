require("../../../utils/util.js");

var t = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        status: -1,
        currentTabsIndex: 10,
        orderList: [],
        currentCatId: 0,
        cash_list: []
    },
    onLoad: function(t) {
        var e = this, r = wx.getStorageSync("userInfo").user_id;
        e.setData({
            user_id: r
        }), this.getOrderList(10);
    },
    catClick: function(t) {
        var e = t.currentTarget.dataset.sid;
        this.setData({
            currentTabsIndex: e
        }), this.getOrderList(e);
    },
    getOrderList: function(r) {
        wx.showLoading({
            title: "加载中..."
        });
        var s = this;
        e.util.request({
            url: t.ShareOrderList,
            data: {
                status: r,
                user_id: s.data.user_id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || s.setData({
                    orderList: t.data.data.orderList
                }), wx.hideLoading();
            }
        });
    }
});