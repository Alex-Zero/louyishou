function t(t, e, r) {
    return e in t ? Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = r, t;
}

require("../../utils/util.js");

var e, r = require("../../config/api.js"), a = getApp();

Page({
    data: (e = {
        keywrod: "",
        user_id: "",
        searchStatus: !1,
        goodsList: [],
        helpKeyword: [],
        historyKeyword: [],
        categoryFilter: !1,
        currentSortType: "default",
        currentSortOrder: "",
        filterCategory: [],
        defaultKeyword: {},
        hotKeyword: [],
        page: 1,
        size: 20
    }, t(e, "currentSortType", "id"), t(e, "currentSortOrder", "desc"), t(e, "categoryId", 0), 
    e),
    closeSearch: function() {
        wx.navigateBack();
    },
    clearKeyword: function() {
        this.setData({
            keyword: "",
            searchStatus: !1
        });
    },
    onLoad: function() {
        var t = wx.getStorageSync("userInfo").user_id, e = wx.getSystemInfoSync();
        this.setData({
            user_id: t,
            windowWidth: e.screenWidth,
            windowHeight: e.screenHeight
        }), this.getSearchKeyword();
    },
    getSearchKeyword: function() {
        var t = this, e = t.data.user_id;
        a.util.request({
            url: r.SearchIndex,
            data: {
                user_id: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), t.setData({
                    historyKeyword: e.data.data.historyKeyword
                });
            }
        });
    },
    inputChange: function(t) {
        this.setData({
            keyword: t.detail.value,
            searchStatus: !1
        }), this.getHelpKeyword();
    },
    getHelpKeyword: function() {
        var t = this;
        a.util.request({
            url: r.SearchHelper,
            data: {
                keyword: t.data.keyword
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), t.setData({
                    helpKeyword: e.data.data.helpKeyword
                });
            }
        });
    },
    inputFocus: function() {
        this.setData({
            searchStatus: !1,
            goodsList: []
        }), this.data.keyword && this.getHelpKeyword();
    },
    clearHistory: function() {
        var t = wx.getStorageSync("userInfo").user_id;
        this.setData({
            historyKeyword: []
        }), a.util.request({
            url: r.SearchClearHistory,
            data: {
                user_id: t
            },
            cachetime: 0,
            success: function(t) {
                console.log("清除成功"), wx.showToast({
                    title: "清除成功"
                });
            }
        });
    },
    getGoodsList: function() {
        var t = this, e = t.data.user_id;
        a.util.request({
            url: r.SearchResult,
            data: {
                user_id: e,
                keyword: t.data.keyword,
                page: t.data.page,
                size: t.data.size,
                sort: t.data.currentSortType,
                order: t.data.currentSortOrder,
                categoryId: t.data.categoryId
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), t.setData({
                    searchStatus: !0,
                    categoryFilter: !1,
                    goodsList: e.data.data.goodsList,
                    filterCategory: e.data.data.filterCategory
                }), t.getSearchKeyword();
            }
        });
    },
    onKeywordTap: function(t) {
        this.getSearchResult(t.target.dataset.keyword);
    },
    getSearchResult: function(t) {
        this.setData({
            keyword: t,
            page: 1,
            categoryId: 0,
            goodsList: []
        }), this.getGoodsList();
    },
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
            }), this.getGoodsList();
            break;

          default:
            this.setData({
                currentSortType: "default",
                currentSortOrder: "desc",
                categoryFilter: !1
            }), this.getGoodsList();
        }
    },
    selectCategory: function(t) {
        var e = t.target.dataset.categoryIndex, r = this.data.filterCategory, a = null;
        for (var o in r) o == e ? (r[o].selected = !0, a = r[o]) : r[o].selected = !1;
        this.setData({
            filterCategory: r,
            categoryFilter: !1,
            categoryId: a.id,
            page: 1,
            goodsList: []
        }), this.getGoodsList();
    },
    onKeywordConfirm: function(t) {
        this.getSearchResult(t.detail.value);
    }
});