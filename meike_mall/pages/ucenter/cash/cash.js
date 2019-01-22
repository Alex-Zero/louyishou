require("../../../utils/util.js");

var t = require("../../../config/api.js"), s = getApp();

Page({
    data: {
        status: -1,
        currentTabsIndex: 10,
        currentCatId: 0,
        cash_list: []
    },
    onLoad: function(t) {
        var s = this, a = wx.getStorageSync("userInfo").user_id;
        s.setData({
            user_id: a
        }), this.getCashList(10);
    },
    catClick: function(t) {
        var s = t.currentTarget.dataset.sid;
        this.setData({
            currentTabsIndex: s
        }), this.getCashList(s);
    },
    getCashList: function(a) {
        wx.showLoading({
            title: "加载中..."
        });
        var e = this;
        s.util.request({
            url: t.CashList,
            data: {
                status: a,
                user_id: e.data.user_id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    cash_list: t.data.data.cash_list
                }), wx.hideLoading();
            }
        });
    }
});