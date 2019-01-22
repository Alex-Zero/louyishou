var t = getApp(), a = require("../../lib/wxParse/wxParse.js"), o = (require("../../utils/util.js"), 
require("../../config/api.js"));

Page({
    data: {
        id: 0,
        topic: {},
        topicList: [],
        sysinfo: {},
        commentCount: 0,
        goodsInfo: {},
        commentList: []
    },
    onLoad: function(e) {
        console.log(e);
        var i = this;
        i.setData({
            id: parseInt(e.id)
        }), t.util.request({
            url: o.Index,
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || i.setData({
                    sysinfo: t.data.data.sysinfo
                });
            }
        }), t.util.request({
            url: o.TopicDetail,
            data: {
                id: i.data.id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (i.setData({
                    topic: t.data.data.topic,
                    goodsInfo: t.data.data.goodsInfo
                }), a.wxParse("topicDetail", "html", t.data.data.topic.content, i), wx.setNavigationBarTitle({
                    title: t.data.data.topic.title
                }));
            }
        }), t.util.request({
            url: o.TopicRelated,
            data: {
                id: i.data.id
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || i.setData({
                    topicList: t.data.data.topicList
                });
            }
        });
    },
    getCommentList: function() {
        var a = this;
        t.util.request({
            url: o.TopicCommentList,
            data: {
                valueId: a.data.id,
                typeId: 1,
                size: 3,
                page: 1
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || a.setData({
                    commentList: t.data.data.commentList,
                    commentCount: t.data.data.commentCount.nums
                });
            }
        });
    },
    postComment: function() {
        wx.navigateTo({
            url: "../commentPost/commentPost?valueId=" + this.data.id + "&typeId=1"
        });
    },
    onReady: function() {},
    onShow: function() {
        this.getCommentList();
    },
    onHide: function() {},
    onUnload: function() {}
});