require("../../../utils/util.js");

var t = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        runList: []
    },
    onLoad: function(t) {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        a.setData({
            user_id: e
        }), this.getCashList();
    },
    getCashList: function() {
        wx.showLoading({
            title: "加载中..."
        });
        var e = this;
        a.util.request({
            url: t.RedRunWaterList,
            data: {
                user_id: e.data.user_id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    runList: t.data.data.runList
                }), wx.hideLoading();
            }
        });
    }
});