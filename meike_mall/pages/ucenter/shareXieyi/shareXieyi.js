var e = getApp(), a = require("../../../lib/wxParse/wxParse.js"), i = (require("../../../utils/util.js"), 
require("../../../config/api.js"));

Page({
    data: {},
    onLoad: function(t) {
        var r = this;
        e.util.request({
            url: i.ShareXieyi,
            cachetime: 0,
            success: function(e) {
                console.log(e), e.data.errno || (r.setData({
                    xieyi: e.data.data.xieyi
                }), a.wxParse("xieyi", "html", e.data.data.xieyi.fxagreement, r));
            }
        });
    }
});