require("../../../utils/util.js");

var t = require("../../../config/api.js"), a = getApp();

Page({
    data: {
        list: []
    },
    onShow: function() {
        var e = this;
        a.util.request({
            url: t.Help,
            cachetime: 0,
            success: function(t) {
                if (!t.data.errno) {
                    for (var a = 0, i = t.data.data.help.length; a < i; ++a) t.data.data.help[a].open = !1;
                    e.setData({
                        list: t.data.data.help
                    });
                }
            },
            fail: function(t) {
                failGo(t.message);
            }
        });
    },
    kindToggle: function(t) {
        console.log(t);
        for (var a = t.currentTarget.id, e = this.data.list, i = 0, o = e.length; i < o; ++i) console.log(e[i].open), 
        e[i].id == a ? e[i].open = !e[i].open : e[i].open = !1;
        this.setData({
            list: e
        });
    }
});