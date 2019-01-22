var e = getApp(), a = require("../../lib/wxParse/wxParse.js"), t = (require("../../utils/util.js"), 
require("../../config/api.js"));

Page({
    data: {
        id: 0,
        news: {}
    },
    onLoad: function(e) {
        this.setData({
            id: parseInt(e.id)
        }), this.getNewsDetail();
    },
    getNewsDetail: function() {
        var i = this;
        e.util.request({
            url: t.NewsDetail,
            data: {
                id: i.data.id
            },
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || (a.wxParse("article1", "html", e.data.data.newsDetail.details, i, 5), 
                i.setData({
                    news: e.data.data.newsDetail
                }));
            }
        });
    }
});