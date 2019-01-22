var t = getApp(), a = (require("../../utils/util.js"), require("../../config/api.js"));

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
    getCommentCount: function() {
        var e = this;
        t.util.request({
            url: a.CommentCount,
            data: {
                valueId: e.data.valueId,
                typeId: e.data.typeId
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || e.setData({
                    allCount: t.data.data.allCount,
                    hasPicCount: t.data.hasPicCount
                });
            }
        });
    },
    getCommentList: function() {
        var e = this;
        t.util.request({
            url: a.CommentList,
            data: {
                valueId: e.data.valueId,
                typeId: e.data.typeId,
                size: e.data.size,
                page: 0 == e.data.showType ? e.data.allPage : e.data.picPage,
                showType: e.data.showType
            },
            cachetime: 0,
            success: function(t) {
                console.log(t), t.data.errno || (0 == e.data.showType ? e.setData({
                    allCommentList: e.data.allCommentList.concat(t.data.data.commentList),
                    allPage: t.data.data.currentPage,
                    comments: e.data.allCommentList.concat(t.data.data.commentList)
                }) : e.setData({
                    picCommentList: e.data.picCommentList.concat(t.data.data.commentList),
                    picPage: t.data.data.currentPage,
                    comments: e.data.picCommentList.concat(t.data.data.commentList)
                }));
            }
        });
    },
    onLoad: function(t) {
        this.setData({
            typeId: t.typeId,
            valueId: t.valueId
        }), this.getCommentCount(), this.getCommentList();
    },
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