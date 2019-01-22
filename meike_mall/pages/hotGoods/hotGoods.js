require("../../utils/util.js");

var t = require("../../config/api.js"), e = getApp();

Page({
    data: {
        categoryFilter: !1,
        filterCategory: [],
        goodsList: [],
        userInfo: {},
        sysinfo: {},
        categoryId: 0,
        currentSortType: "default",
        currentSortOrder: "desc",
        page: 1,
        size: 1e3
    },
    getData: function() {
        this.getGoodsList();
    },
    getGoodsList: function() {
        var r = this, a = wx.getStorageSync("userInfo");
        e.util.request({
            url: t.GoodsHot,
            data: {
                user_id: a.user_id,
                isHot: 1,
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
    onLoad: function(r) {
        var a = wx.getStorageSync("userInfo"), o = this, s = (a.is_people, a.is_store, a.user_id);
        this.setData({
            userInfo: a,
            user_id: s
        }), e.util.request({
            url: t.Index,
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || o.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), this.getData();
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