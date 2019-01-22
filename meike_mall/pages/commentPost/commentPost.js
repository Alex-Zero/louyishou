var t = getApp(), e = require("../../utils/util.js"), a = require("../../config/api.js");

Page({
    data: {
        typeId: 0,
        valueId: 0,
        content: ""
    },
    onLoad: function(t) {
        this.setData({
            typeId: parseInt(t.typeId),
            valueId: parseInt(t.valueId)
        });
    },
    onClose: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onPost: function() {
        var n = this, o = wx.getStorageSync("userInfo");
        if (!this.data.content) return e.showErrorToast("请填写评论"), !1;
        t.util.request({
            url: a.CommentPost,
            data: {
                user_id: o.user_id,
                nickname: o.nickname,
                avatar: o.avatar,
                typeId: n.data.typeId,
                valueId: n.data.valueId,
                content: n.data.content
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || wx.showToast({
                    title: "评论成功",
                    complete: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    bindInpuntValue: function(t) {
        var e = t.detail.value;
        if (e && e.length > 140) return !1;
        this.setData({
            content: t.detail.value
        }), console.log(t.detail);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});