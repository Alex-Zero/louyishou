require("../../../utils/util.js");

var i = require("../../../config/api.js"), a = getApp();

Page({
    data: {},
    onLoad: function(e) {
        var t = this, n = wx.getStorageSync("mch_info"), c = a.siteInfo.uniacid;
        t.setData({
            mch_info: n
        }), a.util.request({
            url: i.TeamPoster,
            data: {
                id: n.id,
                user_id: n.user_id,
                avatar: n.avatar,
                nickname: n.nickname,
                uniacid: c
            },
            cachetime: 0,
            success: function(i) {
                console.log(i);
            }
        });
    }
});