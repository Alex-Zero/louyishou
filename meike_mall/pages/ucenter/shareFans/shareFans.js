require("../../../utils/util.js");

var a = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        userInfo: {},
        sysinfo: {},
        giftGoodsList: [],
        order: {},
        nums: "",
        minus: "",
        tnums: "",
        ynums: "",
        label: "",
        p1: "",
        p2: "",
        p4: ""
    },
    onLoad: function() {
        var o = this;
        t.util.request({
            url: a.Index,
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || o.setData({
                    sysinfo: a.data.data.sysinfo
                });
            }
        }), wx.hideShareMenu(), o.getGiftList();
    },
    buyMenu: function() {
        wx.pageScrollTo({
            scrollTop: 508.7,
            duration: 300
        });
    },
    onShow: function() {
        var o = this, e = wx.getStorageSync("userInfo"), n = e.user_id;
        o.setData({
            userInfo: e
        }), t.util.request({
            url: a.FansList,
            data: {
                user_id: n
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), o.setData({
                    nums: a.data.data.fansCount.nums,
                    tnums: a.data.data.tFans.nums,
                    ynums: a.data.data.yFans.nums,
                    poor: parseFloat(a.data.data.poor),
                    partner: parseFloat(a.data.data.partner),
                    minus: parseFloat(a.data.data.poor - a.data.data.fansCount.nums),
                    p1: parseFloat(a.data.data.poor) + parseFloat(a.data.data.partner),
                    p2: parseFloat(a.data.data.poor) + parseFloat(a.data.data.partner) - a.data.data.fansCount.nums,
                    p3: parseFloat(a.data.data.poor - 1),
                    p4: parseFloat(a.data.data.poor) + parseFloat(a.data.data.partner) - 1
                });
            }
        });
    },
    getGiftList: function() {
        var o = this;
        t.util.request({
            url: a.GiftGoodsList,
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || o.setData({
                    giftGoodsList: a.data.data.goodsList,
                    order: a.data.data.order
                });
            }
        });
    },
    formSubmit: function(o) {
        var e = o.detail.formId, n = wx.getStorageSync("userInfo").user_id;
        t.util.request({
            url: a.FormID,
            data: {
                user_id: n,
                form_id: e
            },
            cachetime: 0,
            success: function(a) {
                console.log("form_id添加成功");
            }
        });
    },
    onShareAppMessage: function() {
        var a = wx.getStorageSync("userInfo").user_id;
        if ("" != a) return {
            title: this.data.sysinfo.title,
            path: "/meike_mall/pages/index/index?share_user_id=" + a + "&type=link",
            imageUrl: this.data.sysinfo.share_image
        };
        wx.showModal({
            title: "提示",
            content: "成功注册后,才可以绑定好友,享受会员折扣",
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), wx.navigateTo({
                    url: "../../auth/index/index"
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    invite: function() {
        var a = this;
        wx.showModal({
            title: "",
            content: "邀请码：" + a.data.userInfo.ivcode,
            confirmText: "复制",
            cancelText: "关闭",
            confirmColor: "#b4282d",
            success: function(t) {
                t.confirm ? wx.setClipboardData({
                    data: a.data.userInfo.ivcode,
                    success: function(a) {
                        wx.getClipboardData({
                            success: function(a) {
                                wx.showToast({
                                    title: "复制成功",
                                    icon: "success",
                                    duration: 2e3
                                });
                            }
                        });
                    }
                }) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    inviter: function() {
        var a = this;
        wx.showModal({
            title: "",
            content: "邀请人：" + a.data.userInfo.inviter,
            showCancel: !1,
            confirmText: "关闭",
            confirmColor: "#b4282d",
            success: function(a) {}
        });
    },
    inviterNull: function() {
        wx.showModal({
            title: "",
            content: "邀请人：总店",
            cancelText: "关闭",
            confirmText: "修改",
            confirmColor: "#b4282d",
            success: function(a) {
                a.confirm ? wx.navigateTo({
                    url: "../addInviter/addInviter"
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    }
});