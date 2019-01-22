require("../../utils/util.js");

var t = require("../../config/api.js"), a = getApp();

Page({
    data: {
        brandList: [],
        page: 1,
        size: 10,
        totalPages: 1
    },
    onLoad: function(t) {
        this.getBrandList();
    },
    getBrandList: function() {
        wx.showLoading({
            title: "加载中..."
        });
        var i = this;
        a.util.request({
            url: t.BrandList,
            data: {
                page: i.data.page,
                size: i.data.size
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || i.setData({
                    brandList: i.data.brandList.concat(t.data.data.brandList),
                    totalPages: t.data.data.totalPages
                }), wx.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        if (!(this.data.totalPages > this.data.page)) return !1;
        this.setData({
            page: this.data.page + 1
        }), this.getBrandList();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});