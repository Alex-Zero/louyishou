require("../../utils/util.js");

var t = require("../../config/api.js"), e = getApp();

Page({
    data: {
        bannerInfo: {
            img_url: "http://yanxuan.nosdn.127.net/1a734852ebcca0a0a328f82b15be2cd8.jpg",
            name: "1111"
        },
        sysinfo: {},
        userInfo: {},
        categoryFilter: !1,
        filterCategory: [],
        goodsList: [],
        categoryId: 0,
        currentSortType: "default",
        currentSortOrder: "desc",
        page: 1,
        size: 1e3
    },
    onLoad: function(r) {
        var a = wx.getStorageSync("userInfo"), o = a.user_id, s = this;
        this.setData({
            userInfo: a,
            user_id: o
        }), e.util.request({
            url: t.Index,
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || s.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), this.getData();
    },
    getData: function() {
        this.getGoodsList();
    },
    getGoodsList: function() {
        var r = this, a = wx.getStorageSync("userInfo");
        e.util.request({
            url: t.GoodsNew,
            data: {
                user_id: a.user_id,
                isNew: 1,
                page: r.data.page,
                size: r.data.size,
                order: r.data.currentSortOrder,
                sort: r.data.currentSortType,
                categoryId: r.data.categoryId
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || r.setData({
                    goodsList: t.data.data.goodsList,
                    filterCategory: t.data.data.filterCategory
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    openSortFilter: function(t) {
        switch (t.currentTarget.id) {
          case "categoryFilter":
            this.setData({
                categoryFilter: !this.data.categoryFilter,
                currentSortType: "category",
                currentSortOrder: "asc"
            });
            break;

          case "priceSort":
            var e = "asc";
            "asc" == this.data.currentSortOrder && (e = "desc"), this.setData({
                currentSortType: "price",
                currentSortOrder: e,
                categoryFilter: !1
            }), this.getData();
            break;

          default:
            this.setData({
                currentSortType: "default",
                currentSortOrder: "desc",
                categoryFilter: !1
            }), this.getData();
        }
    },
    selectCategory: function(t) {
        var e = t.target.dataset.categoryIndex;
        this.setData({
            categoryFilter: !1,
            categoryId: this.data.filterCategory[e].id
        }), this.getData();
    }
});