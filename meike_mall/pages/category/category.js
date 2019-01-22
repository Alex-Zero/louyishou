require("../../utils/util.js");

var t = require("../../config/api.js"), a = getApp();

Page({
    data: {
        navList: [],
        goodsList: [],
        userInfo: {},
        id: 0,
        currentCategory: {},
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        page: 1,
        size: 1e4
    },
    onLoad: function(t) {
        var a = this;
        console.log(t);
        var e = wx.getStorageSync("userInfo");
        a.setData({
            userInfo: e,
            fid: parseInt(t.fid),
            sid: parseInt(t.sid)
        }), wx.getSystemInfo({
            success: function(t) {
                a.setData({
                    scrollHeight: t.windowHeight
                });
            }
        }), this.getCategoryInfo();
    },
    getCategoryInfo: function() {
        var e = this, s = e.data.fid;
        a.util.request({
            url: t.GoodsCategory,
            data: {
                fid: s
            },
            cachetime: 0,
            success: function(t) {
                if (console.log(t), !t.data.errno) {
                    e.setData({
                        navList: t.data.data.navList,
                        currentCategory: t.data.data.currentCategory
                    }), wx.setNavigationBarTitle({
                        title: t.data.data.currentCategory.front_name
                    });
                    for (var a = 0, s = e.data.navList.length, o = 0; o < s && (a += 1, e.data.navList[o].id != e.data.id); o++) ;
                    a > s / 2 && s > 5 && e.setData({
                        scrollLeft: 60 * a
                    }), e.getGoodsList();
                }
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    getGoodsList: function() {
        var e = this, s = e.data.sid;
        a.util.request({
            url: t.GoodsList,
            data: {
                sid: s,
                user_id: e.data.userInfo.user_id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    goodsList: t.data.data.goodsList
                });
            }
        });
    },
    onUnload: function() {},
    switchCate: function(t) {
        if (this.data.sid == t.currentTarget.dataset.id) return !1;
        var a = this, e = t.detail.x, s = t.currentTarget;
        e < 60 ? a.setData({
            scrollLeft: s.offsetLeft - 60
        }) : e > 330 && a.setData({
            scrollLeft: s.offsetLeft
        }), this.setData({
            sid: t.currentTarget.dataset.id
        }), this.getCategoryInfo();
    }
});