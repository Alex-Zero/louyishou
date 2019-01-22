var t = require("../../utils/util.js"), a = require("../../config/api.js"), e = getApp();

Page({
    data: {
        navList: [],
        categoryList: [],
        currentCategory: {},
        scrollLeft: 0,
        scrollTop: 0,
        goodsCount: {},
        scrollHeight: 0
    },
    setTabBar: function(t) {
        var a = wx.getStorageSync("tabbar"), e = wx.getStorageSync("tabColor");
        this.setData({
            tabbar: a,
            curIdx: t,
            tabColor: e
        });
    },
    onLoad: function(t) {
        this.setTabBar(t.curIdx), this.getCatalog();
    },
    getCatalog: function() {
        var t = this;
        wx.showLoading({
            title: "加载中..."
        }), e.util.request({
            url: a.CatalogList,
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || t.setData({
                    navList: a.data.data.navList,
                    currentCategory: a.data.data.currentCategory
                }), wx.hideLoading();
            }
        }), e.util.request({
            url: a.GoodsCount,
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || t.setData({
                    goodsCount: a.data.data.goodsCount
                });
            }
        });
    },
    getCurrentCategory: function(t) {
        var r = this;
        e.util.request({
            url: a.CatalogCurrent,
            data: {
                fid: t
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || r.setData({
                    currentCategory: t.data.data.currentCategory
                });
            }
        });
    },
    getList: function() {
        var e = this;
        t.request(a.ApiRootUrl + "api/catalog/" + e.data.currentCategory.cat_id).then(function(t) {
            e.setData({
                categoryList: t.data
            });
        });
    },
    switchCate: function(t) {
        t.currentTarget;
        if (this.data.currentCategory.id == t.currentTarget.dataset.id) return !1;
        this.getCurrentCategory(t.currentTarget.dataset.id);
    }
});