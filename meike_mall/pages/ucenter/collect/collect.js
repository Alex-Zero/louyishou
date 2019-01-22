var t = require("../../../utils/util.js"), o = require("../../../config/api.js");

getApp();

Page({
    data: {
        typeId: 0,
        collectList: [ {
            id: "1",
            list_pic_url: "https://unsplash.it/200/200",
            name: "1111",
            goods_brief: "222",
            retail_price: "333"
        } ]
    },
    getCollectList: function() {
        var e = this;
        t.request(o.CollectList, {
            typeId: e.data.typeId
        }).then(function(t) {
            0 === t.errno && (console.log(t.data), e.setData({
                collectList: t.data.data
            }));
        });
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    openGoods: function(e) {
        var a = this, n = this.data.collectList[e.currentTarget.dataset.index].value_id, i = a.data.touch_end - a.data.touch_start;
        console.log(i), i > 350 ? wx.showModal({
            title: "",
            content: "确定删除吗？",
            success: function(e) {
                e.confirm && t.request(o.CollectAddOrDelete, {
                    typeId: a.data.typeId,
                    valueId: n
                }, "POST").then(function(t) {
                    0 === t.errno && (console.log(t.data), wx.showToast({
                        title: "删除成功",
                        icon: "success",
                        duration: 2e3
                    }), a.getCollectList());
                });
            }
        }) : wx.navigateTo({
            url: "/pages/goods/goods?id=" + n
        });
    },
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