require("../../../utils/util.js");

var a = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        allTotal: "0.00",
        weiTixian: "",
        haveTixian: ""
    },
    onShow: function() {
        var i = this, o = wx.getStorageSync("userInfo").user_id;
        e.util.request({
            url: a.RedEnvelopeTotal,
            data: {
                user_id: o
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), i.setData({
                    allTotal: a.data.data.allTotal,
                    weiTixian: a.data.data.weiTixian,
                    haveTixian: a.data.data.haveTixian
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.onShow(), wx.stopPullDownRefresh();
    },
    showTips: function() {
        wx.showModal({
            title: "提示",
            content: "再来一单，邀请助力立马提现",
            confirmText: "我知道了",
            confirmColor: "#b4282d",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), wx.switchTab({
                    url: "/meike_mall/pages/index/index"
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    }
});