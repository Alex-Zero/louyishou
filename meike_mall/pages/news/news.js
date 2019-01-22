var s = getApp(), t = (require("../../utils/util.js"), require("../../config/api.js"));

Page({
    data: {
        newsList: []
    },
    onLoad: function(e) {
        var i = this;
        s.util.request({
            url: t.NewsList,
            cachetime: 0,
            success: function(s) {
                console.log(s), i.setData({
                    newsList: s.data.data.newsList
                });
            }
        });
    }
});