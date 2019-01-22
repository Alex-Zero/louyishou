require("../../../utils/util.js");

var e = require("../../../config/api.js"), o = getApp();

Page({
    data: {
        slide: [ {
            image_url: "https://yanxuan.nosdn.127.net/14939843143621089.jpg"
        } ],
        array: [],
        level: [],
        index: 0,
        inviter: "总店",
        money: "",
        commission: "",
        commission2: "",
        image_url: ""
    },
    onLoad: function(e) {
        var o = this, n = wx.getStorageSync("userInfo").inviter;
        wx.showModal({
            title: "提示",
            content: "请认真填写以下信息，保证信息真实有效",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(e) {
                e.confirm ? console.log("用户点击确定") : e.cancel && console.log("用户点击取消");
            }
        }), o.setData({
            inviter: n
        });
    },
    formSubmit: function(n) {
        var t = wx.getStorageSync("userInfo").user_id, r = n.detail.formId, i = n.detail.value.owner, a = n.detail.value.phoneNumber;
        return "" == i ? (o.showErrorModal("请输入真实姓名", "提醒"), !1) : "" == a ? (o.showErrorModal("请输入手机号", "提醒"), 
        !1) : void o.util.request({
            url: e.PerfectShare,
            data: {
                user_id: t,
                owner: i,
                mobile: a,
                form_id: r
            },
            cachetime: 0,
            success: function(e) {
                wx.setStorageSync("userInfo", e.data.data), wx.showModal({
                    title: "通知",
                    content: "您的资料已提交成功，系统正在审核，请留意审核结果通知。",
                    showCancel: !1,
                    confirmText: "我知道了",
                    confirmColor: "#b4282d",
                    success: function(e) {
                        e.confirm ? (console.log("用户点击确定"), wx.navigateBack({
                            delta: 1
                        })) : e.cancel && console.log("用户点击取消");
                    }
                });
            }
        });
    }
});