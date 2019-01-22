function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e) {
    var t = this, i = e.target.dataset.from, d = e.target.dataset.idx;
    void 0 !== i && i.length > 0 && a(e, d, t, i);
}

function a(e, t, a, d) {
    var r = a.data[d];
    if (0 != r.images.length) {
        var n = r.images, s = i(e.detail.width, e.detail.height, a, d);
        n[t].width = s.imageWidth, n[t].height = s.imageheight, r.images = n;
        var o = {};
        o[d] = r, a.setData(o);
    }
}

function i(e, t, a, i) {
    var d = 0, r = 0, n = 0, s = 0, o = {};
    return wx.getSystemInfo({
        success: function(g) {
            var h = a.data[i].view.imagePadding;
            d = g.windowWidth - 2 * h, r = g.windowHeight, e > d ? (s = (n = d) * t / e, o.imageWidth = n, 
            o.imageheight = s) : (o.imageWidth = e, o.imageheight = t);
        }
    }), o;
}

var d = e(require("showdown.js")), r = e(require("html2json.js"));

module.exports = {
    wxParse: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData", a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "html", i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>', n = arguments[3], s = arguments[4], o = n, g = {};
        if ("html" == a) g = r.default.html2json(i, e); else if ("md" == a || "markdown" == a) {
            var h = new d.default.Converter().makeHtml(i);
            g = r.default.html2json(h, e);
        }
        g.view = {}, g.view.imagePadding = 0, void 0 !== s && (g.view.imagePadding = s);
        var m = {};
        m[e] = g, o.setData(m), o.wxParseImgLoad = t;
    },
    wxParseTemArray: function(e, t, a, i) {
        for (var d = [], r = i.data, n = null, s = 0; s < a; s++) {
            var o = r[t + s].nodes;
            d.push(o);
        }
        e = e || "wxParseTemArray", (n = JSON.parse('{"' + e + '":""}'))[e] = d, i.setData(n);
    },
    emojisInit: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", a = arguments[2];
        r.default.emojisInit(e, t, a);
    }
};