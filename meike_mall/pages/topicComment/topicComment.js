getApp();

var t = require("../../utils/util.js"), a = require("../../config/api.js");

Page({
    data: {
        comments: [],
        allCommentList: [],
        picCommentList: [],
        typeId: 0,
        valueId: 0,
        showType: 0,
        allCount: 0,
        hasPicCount: 0,
        allPage: 1,
        picPage: 1,
        size: 20
    },
    onLoad: function(t) {
        console.log(t), this.setData({
            typeId: t.typeId,
            valueId: t.valueId
        }), this.getCommentCount(), this.getCommentList();
    },
    getCommentCount: function() {
        var e = this;
        t.request(a.TopicCommentCount, {
            valueId: e.data.valueId,
            typeId: e.data.typeId
        }).then(function(t) {
            0 === t.errno && e.setData({
                allCount: t.data.allCount,
                hasPicCount: t.data.hasPicCount
            });
        });
    },
    getCommentList: function() {
        var e = this;
        t.request(a.CommentList, {
            valueId: e.data.valueId,
            typeId: e.data.typeId,
            size: e.data.size,
            page: 0 == e.data.showType ? e.data.allPage : e.data.picPage,
            showType: e.data.showType
        }).then(function(t) {
            0 === t.errno && (0 == e.data.showType ? e.setData({
                allCommentList: e.data.allCommentList.concat(t.data.data),
                allPage: t.data.currentPage,
                comments: e.data.allCommentList.concat(t.data.data)
            }) : e.setData({
                picCommentList: e.data.picCommentList.concat(t.data.data),
                picPage: t.data.currentPage,
                comments: e.data.picCommentList.concat(t.data.data)
            }));
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    switchTab: function() {
        this.setData({
            showType: 1 == this.data.showType ? 0 : 1
        }), this.getCommentList();
    },
    onReachBottom: function() {
        if (console.log("onPullDownRefresh"), 0 == this.data.showType) {
            if (this.data.allCount / this.data.size < this.data.allPage) return !1;
            this.setData({
                allPage: this.data.allPage + 1
            });
        } else {
            if (this.data.hasPicCount / this.data.size < this.data.picPage) return !1;
            this.setData({
                picPage: this.data.picPage + 1
            });
        }
        this.getCommentList();
    }
});