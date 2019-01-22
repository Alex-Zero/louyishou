require("../../../utils/util.js");

var t = require("../../../config/api.js"), e = require("../../../utils/wxTimer.js"), r = getApp();

Page({
    data: {
        list: [],
        wxTimerList: {},
        clock: "",
        currentTabsIndex: 10,
        currentCatId: 0,
        beginTime: "00:00:00",
        orderList: []
    },
    onLoad: function(t) {
        this.getOrderList();
        var e = wx.getSystemInfoSync();
        this.setData({
            pixelRatio: e.pixelRatio,
            windowWidth: e.screenWidth,
            windowHeight: e.screenHeight
        });
    },
    getOrderList: function(e) {
        var a = this, e = wx.getStorageSync("userInfo").user_id;
        r.util.request({
            url: t.RapOrderList,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    orderList: t.data.data.orderList
                });
            }
        });
    },
    timet: function() {
        var t = this;
        console.log(t.data.time);
        var r = new e({
            beginTime: t.data.time,
            complete: function() {
                console.log("完成了"), console.log(t.data.time);
            }
        });
        r.start(this), r.calibration();
    },
    onPullDownRefresh: function() {
        this.onLoad();
    },
    buttonClick: function(t) {
        console.log(t);
        t.currentTarget.dataset.id;
        var e = t.currentTarget.dataset.sid, a = (t.currentTarget.dataset.pid, t.currentTarget.dataset.ordersn), i = wx.getStorageSync("userInfo");
        i.nickname, i.avatar, i.user_id, i.openid, r.siteInfo.uniacid, t.currentTarget.dataset.tid, 
        t.currentTarget.dataset.attr, t.currentTarget.dataset.num;
        "help" == e && wx.navigateTo({
            url: "../sharetohelp/sharetohelp?orderId=" + a
        });
    }
});