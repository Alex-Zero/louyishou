function t(a) {
    a.setData({
        clock: o(n)
    }), n <= 0 ? a.setData({
        clock: "已经截止"
    }) : setTimeout(function() {
        n -= 10, t(a);
    }, 10);
}

function o(t) {
    var o = Math.floor(t / 1e3), n = Math.floor(o / 3600), c = a(Math.floor((o - 3600 * n) / 60));
    return n + ":" + c + ":" + a(o - 3600 * n - 60 * c) + " " + a(Math.floor(t % 1e3 / 10));
}

function a(t) {
    return t < 10 ? "0" + t : t;
}

var n = 864e5;

Page({
    data: {
        clock: ""
    },
    onLoad: function() {
        t(this);
    }
});