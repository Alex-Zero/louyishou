var t = require("../../../utils/util.js"), o = require("../../../config/api.js");

getApp();

Page({
    data: {
        footprintList: [ {
            id: "1",
            add_time: "11111",
            item: [ {
                list_pic_url: "",
                name: "3333",
                goods_brief: "2",
                retail_price: "1"
            } ]
        } ]
    },
    getFootprintList: function() {
        var n = this;
        t.request(o.FootprintList).then(function(t) {
            0 === t.errno && (console.log(t.data), n.setData({
                footprintList: t.data.data
            }));
        });
    },
    deleteItem: function(n) {
        var e = this, i = n.currentTarget.dataset.footprint, a = e.data.touch_end - e.data.touch_start;
        console.log(a), a > 350 ? wx.showModal({
            title: "",
            content: "要删除所选足迹？",
            success: function(n) {
                n.confirm && (t.request(o.FootprintDelete, {
                    footprintId: i.id
                }, "POST").then(function(t) {
                    0 === t.errno && (wx.showToast({
                        title: "删除成功",
                        icon: "success",
                        duration: 2e3
                    }), e.getFootprintList());
                }), console.log("用户点击确定"));
            }
        }) : wx.navigateTo({
            url: "/pages/goods/goods?id=" + i.goods_id
        });
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    touchStart: function(t) {
        this.setData({
            touch_start: t.timeStamp
        }), console.log(t.timeStamp + "- touch-start");
    },
    touchEnd: function(t) {
        this.setData({
            touch_end: t.timeStamp
        }), console.log(t.timeStamp + "- touch-end");
    }
});