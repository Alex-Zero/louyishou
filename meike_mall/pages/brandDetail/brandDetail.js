require("../../utils/util.js");

var a = require("../../config/api.js"), t = getApp();

Page({
    data: {
        id: 0,
        brand: {},
        sysinfo: {},
        goodsList: [],
        page: 1,
        size: 1e3
    },
    onLoad: function(s) {
        var e = this;
        e.setData({
            id: parseInt(s.id)
        }), t.util.request({
            url: a.Index,
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || e.setData({
                    sysinfo: a.data.data.sysinfo
                });
            }
        }), this.getBrand();
    },
    getBrand: function() {
        var s = this;
        t.util.request({
            url: a.BrandDetail,
            data: {
                id: s.data.id
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || (s.setData({
                    brand: a.data.data.brand
                }), s.getGoodsList());
            }
        });
    },
    getGoodsList: function() {
        var s = this;
        t.util.request({
            url: a.BrandGoods,
            data: {
                brandId: s.data.id,
                page: s.data.page,
                size: s.data.size
            },
            cachetime: 0,
            success: function(a) {
                console.log(a), a.data.errno || s.setData({
                    goodsList: a.data.data.goodsList
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});