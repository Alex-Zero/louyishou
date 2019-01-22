require("../../../utils/util.js");

var t = require("../../../config/api.js"), s = getApp();

Page({
    data: {
        fansList: []
    },
    onShow: function() {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        s.util.request({
            url: t.FansList,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(t) {
                a.setData({
                    fansList: t.data.data.fansList
                });
            }
        });
    }
});