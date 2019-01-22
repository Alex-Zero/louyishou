var e = getApp(), t = (require("../../../utils/util.js"), require("../../../config/api.js")), a = require("../../../utils/wxTimer.js");

Page({
    data: {
        newsList: [],
        wxTimerList: {},
        rap_price: "",
        clock: "",
        itr: "",
        htr: "",
        teamList: [],
        beginTime: "00:00:00"
    },
    onLoad: function(e) {
        var t = this, a = wx.getStorageSync("userInfo");
        t.setData({
            userInfo: a,
            orderId: e.orderId
        }), wx.hideShareMenu();
    },
    onShow: function() {
        var a = this;
        e.util.request({
            url: t.RedEnvelopeInfo,
            data: {
                orderId: a.data.orderId
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), a.setData({
                    itr: (e.data.data.rap_price - e.data.data.help_price).toFixed(2),
                    rap_price: e.data.data.rap_price,
                    htr: e.data.data.help_price,
                    progress: e.data.data.help_price / e.data.data.rap_price * 100,
                    time: e.data.data.time
                }), a.timet();
            }
        }), e.util.request({
            url: t.RedEnvelopeTiXian,
            data: {
                orderId: a.data.orderId
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), a.setData({
                    newList: e.data.data.newList
                });
            }
        });
    },
    timet: function() {
        var e = this;
        console.log(e.data.time);
        var t = new a({
            beginTime: e.data.time,
            complete: function() {
                console.log("完成了"), console.log(e.data.time);
            }
        });
        t.start(this), t.calibration();
    },
    onPullDownRefresh: function() {
        this.onShow(), wx.stopPullDownRefresh();
    },
    formSubmit: function(a) {
        var r = a.detail.formId, i = wx.getStorageSync("userInfo").user_id;
        e.util.request({
            url: t.FormID,
            data: {
                user_id: i,
                form_id: r
            },
            cachetime: 0,
            success: function(e) {
                console.log("form_id添加成功");
            }
        });
    },
    rapAbout: function() {
        wx.navigateTo({
            url: "../../rapAbout/rapAbout"
        });
    },
    onShareAppMessage: function(e) {
        return e.from, {
            title: "我刚领的红包也分你一个，帮我提现就能拿钱哦~",
            path: "/meike_mall/pages/index/index?orderId=" + this.data.orderId + "&share_user_id=" + this.data.user_id + "&type=link",
            imageUrl: "../../../resource/images/sharehb.jpg"
        };
    }
});