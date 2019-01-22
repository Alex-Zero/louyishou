var e = getApp(), t = require("../../lib/wxParse/wxParse.js"), a = (require("../../utils/util.js"), 
require("../../config/api.js"));

Page({
    data: {
        id: 0,
        news: {}
    },
    onLoad: function(e) {
        this.getNewsDetail();
    },
    getNewsDetail: function() {
        var i = this;
        e.util.request({
            url: a.RapAbout,
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || t.wxParse("article1", "html", e.data.data.rapAbout.instructions, i, 5);
            }
        });
    }
});