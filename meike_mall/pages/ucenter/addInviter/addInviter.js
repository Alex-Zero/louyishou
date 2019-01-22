require("../../../utils/util.js");

var a = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        userIfo: {},
        disabled: !1
    },
    formSubmit: function(t) {
        var r = this, o = r.data.userInfo.ivcode, s = t.detail.value.ivcode, i = r.data.userInfo.user_id, n = r.data.userInfo.avatar, u = r.data.userInfo.nickname;
        if (s == o) return e.showErrorModal("不能填写自己的邀请码", "提醒"), !1;
        e.util.request({
            url: a.AddInviter,
            data: {
                ivcode: s,
                user_id: i,
                avatar: n,
                nickname: u
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), r.setData({
                    disabled: !0
                }), e.showErrorModal("恭喜你，绑定成功！", "提示"), wx.setStorageSync("userInfo", a.data.data), 
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onLoad: function(a) {
        var e = this, t = wx.getStorageSync("userInfo");
        e.setData({
            userInfo: t
        });
    }
});