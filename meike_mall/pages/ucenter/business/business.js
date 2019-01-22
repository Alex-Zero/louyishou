require("../../../utils/util.js");

var t = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        luntext: [ "新入", "附近", "热门" ],
        storeList: [],
        sysinfo: {},
        dots: !1,
        nav: [],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 35,
        currentTab: 0,
        swiperCurrent: 0,
        indicatorDots: !1,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        circular: !0
    },
    swiperChange: function(t) {
        this.setData({
            swiperCurrent: t.detail.current
        });
    },
    changeIndicatorDots: function(t) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        });
    },
    changeAutoplay: function(t) {
        this.setData({
            autoplay: !this.data.autoplay
        });
    },
    intervalChange: function(t) {
        this.setData({
            interval: t.detail.value
        });
    },
    durationChange: function(t) {
        this.setData({
            duration: t.detail.value
        });
    },
    info: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../businessInfo/businessInfo?id=" + e
        });
    },
    onLoad: function(n) {
        var a = this;
        wx.getLocation({
            type: "wgs84",
            success: function(t) {
                console.log(t);
                t.latitude, t.longitude;
                wx.setStorageSync("Location", t);
            },
            fail: function() {
                wx.setStorageSync("Location", "");
            }
        }), "" == wx.getStorageSync("Location") || this.reload(), e.util.request({
            url: t.Index,
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        });
    },
    reload: function(n) {
        var a = this;
        e.util.request({
            url: t.StoreType,
            cachetime: 0,
            success: function(t) {
                console.log(t);
                var e = t.data.data.store;
                e.length <= 5 ? a.setData({
                    height: 185
                }) : e.length > 5 && e.length < 11 ? a.setData({
                    height: 380
                }) : e.length > 10 && a.setData({
                    height: 400,
                    dots: !0
                });
                for (var n = [], o = 0, i = e.length; o < i; o += 10) n.push(e.slice(o, o + 10));
                a.setData({
                    nav: n
                });
            }
        });
        a.data.star1;
        e.util.request({
            url: t.StoreList,
            data: {
                lat: wx.getStorageSync("Location").latitude,
                lng: wx.getStorageSync("Location").longitude
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), a.setData({
                    storeList: t.data.data.storeList
                });
            }
        });
    },
    sellted: function(t) {
        wx.navigateTo({
            url: "../settled/settled",
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    store: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../sellerinfo/sellerinfo?id=" + e,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    notice: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../notice/notice?id=" + e,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    phone: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    store_type_id: function(t) {
        var e = t.currentTarget.dataset.id, n = t.currentTarget.dataset.sid, a = t.currentTarget.dataset.name;
        console.log(e), wx.navigateTo({
            url: "../businessNext/businessNext?id=" + e + "&name=" + a + "&sid=" + n,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reload(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});