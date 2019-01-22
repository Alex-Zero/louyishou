require("../../../utils/util.js");

var a = require("../../../config/api.js"), t = getApp();

Page({
    data: {
        userInfo: {},
        partnerInfo: {},
        nums: "",
        minus: "",
        tnums: "",
        ynums: "",
        poor: "30"
    },
    onShow: function() {
        var e = this, o = wx.getStorageSync("userInfo"), n = o.user_id;
        e.setData({
            userInfo: o,
            user_id: n
        }), t.util.request({
            url: a.StoreInfo,
            data: {
                user_id: n
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), e.setData({
                    todayFans: a.data.data.todayFans,
                    allFans: a.data.data.allFans,
                    allTraffic: a.data.data.allTraffic,
                    todayTotal: a.data.data.todayTotal,
                    yesterdayTotal: a.data.data.yesterdayTotal,
                    allTotal: a.data.data.allTotal
                });
            }
        }), t.util.request({
            url: a.Partner,
            data: {
                user_id: n
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), e.setData({
                    partnerInfo: a.data.data.partnerInfo
                });
            }
        }), t.util.request({
            url: a.LevelList,
            cachetime: 0,
            success: function(a) {
                console.log(a), e.setData({
                    fxset: a.data.data.fxset
                });
            }
        });
    },
    upgrade: function() {
        var a = wx.getStorageSync("userInfo"), t = a.user_id, e = a.is_people, o = a.is_store;
        "2" == e ? wx.navigateTo({
            url: "../updatePeople/updatePeople?user_id=" + t
        }) : "2" == o && wx.navigateTo({
            url: "../updateStore/updateStore?user_id=" + t
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
    },
    index: function() {
        wx.switchTab({
            url: "/meike_mall/pages/index/index"
        });
    }
});