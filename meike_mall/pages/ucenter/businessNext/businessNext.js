require("../../../utils/util.js");

var t = require("../../../config/api.js"), e = getApp();

Page({
    data: {
        navList: [],
        goodsList: [],
        id: 0,
        currentCategory: {},
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        page: 1,
        size: 1e4
    },
    onLoad: function(t) {
        var e = this;
        console.log(t), e.setData({
            fid: parseInt(t.id),
            sid: parseInt(t.sid)
        }), wx.setNavigationBarTitle({
            title: t.name
        }), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    scrollHeight: t.windowHeight
                });
            }
        }), e.getCategoryInfo();
    },
    info: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../businessInfo/businessInfo?id=" + e
        });
    },
    getCategoryInfo: function() {
        var a = this, s = a.data.fid;
        e.util.request({
            url: t.StoreTypeNext,
            data: {
                fid: s
            },
            cachetime: 0,
            success: function(t) {
                if (console.log(t), !t.data.errno) {
                    a.setData({
                        navList: t.data.data.navList
                    });
                    for (var e = 0, s = a.data.navList.length, i = 0; i < s && (e += 1, a.data.navList[i].id != a.data.id); i++) ;
                    e > s / 2 && s > 5 && a.setData({
                        scrollLeft: 60 * e
                    }), a.getStoreList();
                }
            }
        });
    },
    getStoreList: function() {
        var a = this, s = a.data.sid;
        e.util.request({
            url: t.StoreListNext,
            data: {
                sid: s,
                lat: wx.getStorageSync("Location").latitude,
                lng: wx.getStorageSync("Location").longitude
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    storeList: t.data.data.storeListNext
                });
            }
        });
    },
    onUnload: function() {},
    switchCate: function(t) {
        if (this.data.sid == t.currentTarget.dataset.id) return !1;
        var e = this, a = t.detail.x, s = t.currentTarget;
        a < 60 ? e.setData({
            scrollLeft: s.offsetLeft - 60
        }) : a > 330 && e.setData({
            scrollLeft: s.offsetLeft
        }), this.setData({
            sid: t.currentTarget.dataset.id
        }), this.getStoreList();
    }
});