require("../../utils/util.js");

var t = require("../../config/api.js"), a = getApp();

Page({
    data: {
        topicList: [],
        allTopicList: [],
        page: 1,
        size: 10,
        count: 0,
        scrollTop: 0,
        showPage: !1
    },
    setTabBar: function(t) {
        var a = wx.getStorageSync("tabbar"), o = wx.getStorageSync("tabColor");
        this.setData({
            tabbar: a,
            curIdx: t,
            tabColor: o
        });
    },
    onLoad: function(o) {
        var i = this;
        console.log(o.curIdx), void 0 != o.curIdx && i.setTabBar(o.curIdx), a.util.request({
            url: t.TopicCount,
            cachetime: 0,
            success: function(t) {
                t.data.errno || i.setData({
                    count: t.data.data.allCount
                });
            }
        }), this.getTopic();
    },
    getTopic: function() {
        var o = this;
        o.setData({
            scrollTop: 0,
            showPage: !1,
            topicList: []
        }), wx.showToast({
            title: "加载中...",
            icon: "loading",
            duration: 2e3
        }), a.util.request({
            url: t.TopicList,
            data: {
                page: o.data.page,
                size: o.data.size
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), o.setData({
                    allTopicList: o.data.allTopicList.concat(t.data.data.topicList),
                    page: t.data.data.currentPage,
                    topicList: o.data.allTopicList.concat(t.data.data.topicList)
                }), wx.hideToast();
            }
        });
    },
    onReachBottom: function() {
        if (console.log("onPullDownRefresh"), this.data.count / this.data.size < this.data.page) return !1;
        this.setData({
            page: this.data.page + 1
        }), this.getTopic();
    }
});